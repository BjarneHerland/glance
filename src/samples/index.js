import Images from 'paraview-glance/src/samples/images';

const version =
  window.GLANCE_VERSION && window.GLANCE_VERSION !== 'master'
    ? window.GLANCE_VERSION
    : 'master';

// prettier-ignore
export default [
  {
    label: 'COVID-19',
    image: Images.Covid19,
    size: '8.4 MB',
    description: 'Lung CT Scan of a COVID-19 patient exhibiting ground-glass opacities (GGO)',
    acknowledgement: 'Joseph Paul Cohen and Paul Morrison and Lan Dao, "COVID-19 image data collection", arXiv:2003.11597, 2020',
    datasets: [
      {
        name: 'covid19.glance',
        url: `https://raw.githubusercontent.com/Kitware/paraview-glance/${version}/data/covid19.glance`,
      },
    ],
  },
  {
    label: '202-t + Edges',
    image: Images.CAD,
    size: '112 KB',
    description: 'T-Handle, Flanged Base, Solid Bar',
    acknowledgement: 'https://www.traceparts.com/',
    datasets: [
      {
        name: '202-t.glance',
        url: `https://raw.githubusercontent.com/Kitware/paraview-glance/${version}/data/202-t.glance`,
      },
    ],
  },
  {
    label: 'TieFighter',
    image: Images.CAD,
    size: '112 KB',
    description: 'T-Handle, Flanged Base, Solid Bar',
    acknowledgement: 'https://www.traceparts.com/',
    datasets: [
      {
        name: 'TieFighter',
        url: `http://localhost:8080/TieFighter.glance`,
      },
    ],
  },
  {
    label: 'Cylinder',
    image: Images.CAD,
    size: 'Not large',
    description: 'Demo from Python-generator',
    acknowledgement: 'Bjarne',
    datasets: [
      {
        name: 'cylinder',
        url: `file:/Users/bjarne/Work/OlavOlsen/ParaviewWeb-glance/T1.vtu`,
      },
    ],
  }
];
