import React from 'react';
import ReactDOM from 'react-dom/client';
import * as singleSpa from 'single-spa';
import './index.css';
import get from 'lodash/get';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { insertLibMap, registerApp } from './micro';
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const mockProjectList = [
  {
    name: 'otmsMicro1',
    // prefix: ["warehouseManage/", "smartSupplyChain/", "channelManage/", "dataBoard/", "system/"],
    prefix: [
      'warehouseManage/',
      'centerConsole/dataReportForm',
      'centerConsole/settlementReport',
      'onTmsSystem/rosManage',
      'dataHub/channelManage/',
      'transportCapacity/vendorPriceForSpeed',
      'transportCapacity/vendorParameterManage',
      'system/'
    ],
    main: '/micro/otmsMicro1/static/page.js',
    store: '/micro/otmsMicro1/static/store.js',
    base: false,
  }, {
    "name": "vehicleMonitor",
    "prefix": ["centerConsole/vehicleMonitor"],
    "path": "/micro/vehicleMonitor/static/",
    "main": "/micro/vehicleMonitor/static/page.574ed96e.js",
    "base": false
  }
];

const init = async () => {
  let projectConfig = [];
  if (process.env.NODE_ENV === 'development') {
    projectConfig = mockProjectList;
  } else {
    // 也可以从网络获取
    projectConfig = await fetch(`/micro/config.json`).then((d) => d.json());
  }
  insertLibMap(projectConfig);
  // 子项目加载projectConfig文件注册
  projectConfig.forEach((element) => {
    registerApp(element, window.globalEventDistributor, history);
  });
  console.log('启动完毕');
  // singleSpa 启动
  singleSpa.start();
  // 监听子项目挂在卸载情况
  window.addEventListener('single-spa:app-change', (e) => {
    const mountedApp = get(e, ['detail', 'appsByNewStatus', 'MOUNTED'], []);
    // window.globalEventDistributor.dispatch('main', updateMicroAppMounted(mountedApp))
  });
};

init();
