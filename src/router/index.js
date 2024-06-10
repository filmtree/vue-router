import { createRouter, createWebHistory, isNavigationFailure } from "vue-router";

import Home from "@/pages/Home.vue";
// import About from "@/pages/About.vue";
// 지연로딩을 위한 Import 함수 사용
const About = () => import('@/pages/About.vue')
import Members from "@/pages/Members.vue";
import Videos from "@/pages/Videos.vue";
import MemberInfo from "@/pages/MemberInfo.vue";
import VideoPlayer from "@/pages/VideoPlayer.vue";
import NotFound from '@/pages/NotFound.vue';

const membersIdGuard = (to, from) => {
  // members/:id 경로는 반드시 이전 경로가
  // /members, /members:id 인 경우만 내비게이션 허용함
  if (from.name !== "members" && from.name !== "members/id") {
    return false;
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
    { path: "/members", name: "members", component: Members },
    {
      path: "/members/:id",
      name: "members/id",
      component: MemberInfo,
      // 개별 라우트 수준 내비게이션 가드
      //    beforeEnter: (to, from) => {// false를 리턴하면 내비게이션이 중단}
      beforeEnter: membersIdGuard, props: true
    },
    {
      path: "/songs",
      name: "videos",
      component: Videos,
      children: [{ path: ":id", name: "videos/id", component: VideoPlayer }],
    },
    {
        path: '/:paths(.*)*', name: 'NotFound', component: NotFound
    }
  ],
});

//  내비게이션 가드
/*
 * @param from 이동전 현재 경로 정보
 * @param to 이동하려는 경로
 * 경로 정보 RouteLocationNormalized 객체로 표현
 */
router.beforeEach((to, from) => {
  // 내비게이션이 정상적으로 완료되도록 하려면 아무런 값을 리턴하지 않거나 true를 리턴
  // 내비게이션을 취소하려면 명시적으로 false를 리턴
  // return false
  // 다른 경로로 리디렉션시키려면 이동시키려는 경로 문자열 또는 Route 객체를 리턴
  // return '/videos/1'
  // return {name: 'members/id', params: {id:2}}

  //to.query에 속성이 존재할 경우 제거된 경로로 재이동
  if (to.query && Object.keys(to.query).length > 0) {
    return { path: to.path, query: {}, params: to.params };
  }
});

router.afterEach((to, from, failure) => {
  // 내비게이션을 실패했을 때 failure 정보를 이용해 실패 처리 가능.
  //   if (isNavigationFailure(failure)) {
  //   }
  if (isNavigationFailure(failure)) {
    console.log("@@ 내비게이션 중단 : ", failure);
    return { name: "home" };
  }
});

export default router;
