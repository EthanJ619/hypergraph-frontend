import Vue from 'vue'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/sidebar.vue'
// import depre_index from '@/views/index/depre_index.vue'
import index from '@/views/index/index.vue'
// import metastasis from "@/views/lung/metastasis";
// import earlyLung from "@/views/lung/earlyLung";
import FactorHg from "@/components/tab/factorHg.vue"
import SpatialHg from "@/components/tab/spatialHg.vue"
/* import TaskInfo from "@/components/tab/subcomponents/TaskInfo.vue"
import DataSelect from "@/components/tab/subcomponents/DataSelect.vue"
import AlgorithmSelect from "@/components/tab/subcomponents/AlgorithmSelect.vue"
import FeatureSelect from "@/components/tab/subcomponents/FeatureSelect.vue" */
import FactorHgVis from "@/components/tab/subcomponents/factorHgVis.vue"
import SpatialHgVis from "@/components/tab/subcomponents/spatialHgVis.vue"
import HGconstruct from "@/components/tab/HGconstruct.vue";
/* import depre_dataManage from "@/components/tab/depre_dataManage.vue";
import depre_taskManage from "@/components/tab/depre_taskManage.vue";
import depre_columnManage from "@/components/tab/depre_columnManage.vue";
import columnManage from "@/components/tab/columnManage.vue"; */
import taskManage from "@/components/tab/taskManage.vue";
import dataManage from "@/components/tab/dataManage.vue";
import diseaseManage from '@/components/tab/diseaseManager.vue'
import logManage from '@/components/tab/logManage.vue'
import userManage from '@/components/tab/userManage.vue'
import AdminDataManage from '@/components/tab/AdminDataManage.vue'

import logIn from '@/views/user/Login.vue'
import register from '@/views/user/register.vue'
import forget from '@/views/user/forget.vue'
import intro from "@/components/tab/intro.vue";
import updatePassword from '@/views/user/updatePassword.vue'
import userCenter from '@/views/user/userCenter.vue'
import inform from '@/views/inform.vue'
import unauthorized from '@/views/404.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: logIn
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/forget',
    name: 'forget',
    component: forget
  },
  {
    path: '/',
    redirect: '/index',
    name: 'index',
    component: SideBar,
    children: [{
      path: '/intro',
      name: 'intro',
      component: intro
    },
    /* {
      path: '/depre_index',
      name: 'depre_index',
      component: depre_index
    }, */
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/dataManage',
      name: 'dataManage',
      component: dataManage,
    },
    {
      path: '/factorHg',
      name: 'factorHg',
      component: FactorHg,
    },
    {
      path: '/spatialHg',
      name: 'spatialHg',
      component: SpatialHg,
    },
    /* {
      path: '/taskInfo',
      name: 'taskInfo',
      component: TaskInfo,
    },
    {
      path: '/dataSelect',
      name: 'dataSelect',
      component: DataSelect,
    },
    {
      path: '/algorithmSelect',
      name: 'algorithmSelect',
      component: AlgorithmSelect,
    },
    {
      path: '/FeatureSelect',
      name: 'FeatureSelect',
      component: FeatureSelect,
    }, */
    {
      path: '/factorHgVis',
      name: 'factorHgVis',
      component: FactorHgVis,
    },
    {
      path: '/spatialHgVis',
      name: 'spatialHgVis',
      component: SpatialHgVis,
    },
    {
      path: '/HGconstruct',
      name: 'HGconstruct',
      component: HGconstruct,
    },
    {
      path: '/taskManage',
      name: 'taskManage',
      component: taskManage,
    },
    {
      path: '/diseaseManage',
      name: 'diseaseManage',
      component: diseaseManage
    },
    {
      path: '/logManage',
      name: 'logManage',
      component: logManage
    },
    {
      path: '/userManage',
      name: 'userManage',
      component: userManage
    },
    {
      path: '/AdminDataManage',
      name: 'AdminDataManage',
      component: AdminDataManage
    },
    {
      path: '/updatePassword',
      name: 'updatePassword',
      component: updatePassword
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    },
    {
      path: '/inform',
      name: 'inform',
      component: inform
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: unauthorized,
    },
      /* {
        path:'/depre_dataManage',
        name:'depre_dataManage',
        component:depre_dataManage,
      },
      {
        path:'/depre_taskManage',
        name:'depre_taskManage',
        component:depre_taskManage,
      },
      {
        path:'/depre_columnManage',
        name:'depre_columnManage',
        component:depre_columnManage,
      },
      {
        path:'/columnManage',
        name:'columnManage',
        component:columnManage,
      },
        {
          path : '/metastasis',
          name: 'metastasis',
          component : metastasis
        },
        {
          path : '/earlyLung',
          name: 'earlyLung',
          component : earlyLung,
          children:[ */
    ]
  },
]

const whiteList = ['/logIn', '/register', '/unauthorized', '/forget']

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果在白名单中，则直接放行
    next()
  } else {
    const userRoles = sessionStorage.getItem('userrole'); // 从sessionStorage获取用户角色信息
    let record = to.matched[to.matched.length - 1]
    let isAuthorized = false; // 初始化权限标志为false

    if (record.meta.roles) {

      // 检查用户角色是否在路由允许的角色列表中
      if (record.meta.roles.includes(userRoles)) {
        isAuthorized = true; // 如果找到匹配的角色，设置权限标志为true
      }
    }
    if (isAuthorized) {

      next(); // 用户有权限，允许访问
    } else if (to.matched.some(record => record.meta.roles)) {

      next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
    } else {

      next(); // 如果没有定义roles元数据，允许所有用户访问
    }
  }
});

export default router
