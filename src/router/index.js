import Vue from 'vue'
import VueRouter from 'vue-router'
import { getRequest } from "@/utils/requestApi";

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
import intro from "@/views/intro.vue";
import manual from "@/views/manual.vue";
import updatePassword from '@/views/user/updatePassword.vue'
import userCenter from '@/views/user/userCenter.vue'
import inform from '@/views/inform.vue'
import unauthorized from '@/views/404.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    // path: '/',
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
    {
      path: '/manual',
      name: 'manual',
      component: manual
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
      // component: index,  //山东&绵阳部署
      component: logIn,
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

const whiteList = ['/login', '/register', '/unauthorized', '/forget']

/* const router = new VueRouter({
  mode: 'history',
  base: '/software6/',      //山东部署新增
  routes
}) */

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

/* 山东部署 */
/* router.beforeEach(async (to, from, next) => {
  const username = sessionStorage.getItem('username');
  console.log(to);
  if (!username) {
    // 检查 URL 参数
    const repKey = to.query?.repKey;
    console.log("repKey:", repKey);
    if (repKey) {
      // 单点登录
      const resp = await getRequest(`/login?key=${repKey}`);
      if (resp) {
        if (resp.code == "200") {
          console.log("返回值：", resp)
          sessionStorage.setItem("username", resp.data.username);
          sessionStorage.setItem("userid", resp.data.uid);
          sessionStorage.setItem("userrole", resp.data.role);
          return next('/intro'); // 跳转到 SoftwareIntro 页面
        } else {
          return next('/unauthorized');
        }
      } else {
        return next('/unauthorized');
      }
    }
    else {
      // 跳转到未授权页面
      return next({ path: '/unauthorized' });
    }
  } else {
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
  }
}); */


/* 绵阳单点登录 */
/* router.beforeEach(async (to, from, next) => {
  try {
    //无权限页面不需要判断用户信息就放行
    if (to.path == '/unauthorized') {
      return next();
    }

    // 检查 session 里的用户信息
    const user = sessionStorage.getItem('user');
    // 如果没有用户信息
    if (!user) {
      // 检查 URL 参数
      const repKey = to.query?.repKey;
      console.log("repKey:", repKey);
      if (repKey) {
        // 绵阳单点登录
        const resp = await getRequest(`/login?repKey=${repKey}`);
        if (resp) {
          console.log("后台回复的code", resp.code);
          console.log("后台回复的UserName", resp.data.username);
          console.log("后台回复的UserCode", resp.data.uid);
          if (resp.code == "200") {
            sessionStorage.setItem("user", resp.data.username);
            sessionStorage.setItem("uid", resp.data.uid);
            sessionStorage.setItem("userrole", resp.data.role);
            return next('/intro'); // 跳转到 SoftwareIntro 页面
          } else {
            return next('/unauthorized');
          }
        } else {
          return next('/unauthorized');
        }
      } else {
        // 跳转到未授权页面
        return next('/unauthorized');
      }
    } else {
      // 如果有用户信息
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
  } catch (error) {
    // 如果代码有问题，可以在这里捕获并处理错误
    console.error('导航守卫出错:', error);
    // 跳转到未授权页面
    return next('/unauthorized');
  }
}); */


export default router
