import * as singleSpa from 'single-spa';

const SystemJS = window.System;
const activeFn = (location: { [key: string]: any }, prefixes: string[]) => prefixes.some((prefix) => location.href.indexOf(`${location.origin}/${prefix}`) !== -1);

// 初始化 子项目system import 配置
const intiComponents = (projectConfig) => {
  const imports = projectConfig.reduce((res, item) => {
    const { name, main } = item;
    res[name] = main;
    return res;
  }, {});
  const newScript = document.createElement('script');
  newScript.type = 'systemjs-importmap';
  newScript.text = JSON.stringify({ imports });
  const headEle = document.querySelector('head');
  headEle.appendChild(newScript);
};

// type="systemjs-importmap"的script标签插入html中
const insertNewImportMap = (newMapJSON) => {
  const newScript = document.createElement('script');
  newScript.type = 'systemjs-importmap';
  newScript.text = JSON.stringify(newMapJSON);
  const allMaps = document.querySelectorAll('script[type="systemjs-importmap"]');
  (allMaps[allMaps.length - 1].insertAdjacentElement)('afterEnd', newScript);
};

const devDependencies = {
  imports: {
  }
};

const prodDependencies = {
  imports: {
  }
};

export const insertLibMap = (projectConfig) => {
  const devMode = true; // 判断环境加载不同依赖
  intiComponents(projectConfig);
  if (devMode) {
    insertNewImportMap(devDependencies);
  } else {
    insertNewImportMap(prodDependencies);
  }
};

export const registerApp = async (params, globalEventDistributor, history) => {
  // 导入派发器
  let storeModule  = {};
  const customProps = {};

  // 用SystemJS来导入子模块的对外输出的Store,统一挂载到globalEventDistributor
  try {
    storeModule = params.store ? await SystemJS.import(params.store) : { storeInstance: null };
  } catch (e) {
    console.log(`无法获取 ${params.name} app 的store`, e);
    // 如果失败则不注册该模块
    return;
  }

  // 注册应用于事件派发器
  if (storeModule.storeInstance && globalEventDistributor) {
    // 取出 redux storeInstance
    customProps.store = storeModule.storeInstance;
    // 注册到全局
    globalEventDistributor.registerStore(storeModule.storeInstance);
  }
  customProps.globalEventDistributor = globalEventDistributor;
  customProps.history = history;
  // 在注册的时候传入 customProps
  singleSpa.registerApplication(
    params.name,
    () => SystemJS.import(params.name),
    params.base ? () => true : (location) => activeFn(location, params.prefix),
    customProps
  );
};