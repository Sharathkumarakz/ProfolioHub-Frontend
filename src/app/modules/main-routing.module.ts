import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo:'app',
    pathMatch:'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'app',
    loadChildren: () =>
      import('../modules/user/user.module').then((m) => m.UserModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
