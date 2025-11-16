import samples from 'paraview-glance/src/samples';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';

export default {
  name: 'Landing',
  components: {
    DragAndDrop,
  },
  data() {
    return {
      samples,
      version: window.GLANCE_VERSION || 'no version available',
      serverOrigin: window.location.origin,
    };
  },
  methods: {
    openSample(sample) {
      const urls = [];
      const names = [];
      for (let i = 0; i < sample.datasets.length; ++i) {
        const datasetUrl = sample.datasets[i].url.startsWith('http')
          ? sample.datasets[i].url
          : `${this.serverOrigin}${sample.datasets[i].url}`;
        urls.push(datasetUrl);
        names.push(sample.datasets[i].name);
      }
      this.$emit('open-urls', sample.label, urls, names);
    },
  },
};
