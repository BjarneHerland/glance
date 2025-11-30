import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import Mousetrap from 'mousetrap';
import { VBottomSheet, VDialog } from 'vuetify/lib';
import macro from '@kitware/vtk.js/macro';

import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import StateFileGenerator from 'paraview-glance/src/components/core/StateFileGenerator';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import CollapsibleToolbar from 'paraview-glance/src/components/widgets/CollapsibleToolbar';
import CollapsibleToolbarItem from 'paraview-glance/src/components/widgets/CollapsibleToolbar/Item';

import shortcuts from 'paraview-glance/src/shortcuts';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    BrowserIssues,
    CollapsibleToolbar,
    CollapsibleToolbarItem,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    LayoutView,
    Screenshots,
    StateFileGenerator,
    SvgIcon,
    VBottomSheet,
    VDialog,
  },
  provide() {
    return {
      $notify: this.notify,
    };
  },
  data() {
    return {
      aboutDialog: false,
      errorDialog: false,
      fileUploadDialog: false,
      autoloadDialog: false,
      autoloadLabel: '',
      internalControlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
      globalSingleNotification: '',
      notifyPermanent: false,
      requiredModel: null,
      version: window.GLANCE_VERSION || 'no version available',
      serverOrigin: window.location.origin,
      requiredModelInput: '',
    };
  },
  computed: {
    controlsDrawer: {
      get() {
        return this.internalControlsDrawer;
      },
      set(visible) {
        this.internalControlsDrawer = !!visible;
      },
    },
    ...mapState({
      loadingState: 'loadingState',
      landingVisible: (state) => state.route === 'landing',
      screenshotsDrawerStateless(state) {
        // Keep screenshot drawer open if screenshot was taken from
        // the "Capture Active View" button.
        return this.screenshotsDrawer && !!state.screenshotDialog;
      },
      smallScreen() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      dialogType() {
        return this.smallScreen ? 'v-bottom-sheet' : 'v-dialog';
      },
    }),
    ...mapGetters('files', {
      anyFileLoadingErrors: 'anyErrors',
      fileLoadingProgress: 'totalProgress',
    }),
  },
  proxyManagerHooks: {
    onProxyModified() {
      if (!this.loadingState) {
        this.$proxyManager.autoAnimateViews();
      }
    },
  },
  created() {
    this.internalControlsDrawer = !this.smallScreen;
  },
  mounted() {
    this.$root.$on('open_girder_panel', () => {
      this.fileUploadDialog = true;
    });
    this.initViews();
    this.initializeAnimations();

    // attach keyboard shortcuts
    shortcuts.forEach(({ key, action }) =>
      Mousetrap.bind(key, (e) => {
        e.preventDefault();
        this.$store.dispatch(action);
      })
    );

    // listen for errors
    window.addEventListener('error', this.recordError);

    // listen for vtkErrorMacro
    macro.setLoggerFunction('error', (...args) => {
      this.recordError(args.join(' '));
      window.console.error(...args);
    });

    // read required model query parameter and, if present, load it directly
    this.requiredModel = new URLSearchParams(window.location.search).get('model');
    if (this.requiredModel) {
      const raw = decodeURIComponent(this.requiredModel);
      let datasetUrl = raw;
      if (!datasetUrl.match(/^(https?:|file:)/)) {
        if (datasetUrl.startsWith('/')) {
          datasetUrl = `${window.location.origin}${datasetUrl}`;
        } else {
          datasetUrl = `${window.location.origin}/${datasetUrl}`;
        }
      }
      const name = datasetUrl.split('/').pop().split('?')[0];
      // use label = name for display
      this.autoLoadRemotes(name, [datasetUrl], [name], raw);
    }
    // wire requiredModelInput default value to query parameter for convenience
    if (this.requiredModel) {
      this.requiredModelInput = decodeURIComponent(this.requiredModel);
    }
  },
  beforeDestroy() {
    window.removeEventListener('error', this.recordError);
    shortcuts.forEach(({ key }) => Mousetrap.unbind(key));
  },
  methods: {
    ...mapMutations({
      showApp: 'showApp',
      showLanding: 'showLanding',
      toggleLanding() {
        if (this.landingVisible) {
          this.showApp(); // BGH shows app on whole screen
        } else {
          this.showLanding();
        }
      },
    }),
    ...mapActions({
      saveState: 'saveState',
      initViews: 'views/initViews',
    }),
    ...mapActions('files', [
      'openFiles',
      'openRemoteFiles',
      'load',
      'resetQueue',
    ]),
    ...mapActions('animations', ['initializeAnimations']),
    showFileUpload() {
      this.fileUploadDialog = true;
    },
    openFileList(fileList) {
      this.fileUploadDialog = true;
      this.$nextTick(() => this.openFiles(Array.from(fileList)));
    },
    autoLoadRemotes(label, urls, names, model) {
      // store model if provided
      if (model) {
        this.requiredModel = model;
      }
      const remotes = urls.map((url, index) => ({
        name: names[index],
        url,
      }));
      this.autoloadDialog = true;
      this.autoloadLabel = label;
      setTimeout(
        () =>
          this.openRemoteFiles(remotes)
            .then(() => this.load())
            .then(() => {
              if (this.anyFileLoadingErrors) {
                this.$nextTick(() => {
                  this.fileUploadDialog = true;
                });
              } else {
                this.doneLoadingFiles();
              }
            })
            .finally(() => {
              this.resetQueue();
              this.autoloadDialog = false;
            }),
        // hack to allow loading sample dialog to show up
        10
      );
    },
    doneLoadingFiles() {
      this.showApp();
    },
    recordError(error) {
      this.errors.push(error);
    },
    notify(msg, permanent = false) {
      if (this.globalSingleNotification) {
        this.globalSingleNotification = '';
        this.permanent = false;
      }
      this.$nextTick(() => {
        this.globalSingleNotification = msg;
        this.notifyPermanent = permanent;
      });
    },
    openSample(sample, modelParam = null) {
      const model = modelParam || this.requiredModel || new URLSearchParams(window.location.search).get('model');
      if (!model) {
        console.error('Missing required query parameter: model');
        window.alert('Cannot open sample: required query parameter "model" is missing.');
        return;
      }
      const urls = [];
      const names = [];
      for (let i = 0; i < sample.datasets.length; ++i) {
        const datasetUrl = (sample.datasets[i].url.startsWith('http') || sample.datasets[i].url.startsWith('file'))
          ? sample.datasets[i].url
          : `${window.location.origin}${sample.datasets[i].url}`;
        urls.push(datasetUrl);
        names.push(sample.datasets[i].name);
      }
      this.autoLoadRemotes(sample.label, urls, names, model);
      // TODO original code did this
      // this.$emit('open-urls', sample.label, urls, names);
    }

  },
};
