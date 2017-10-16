import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthComponent} from "./components/auth/auth.component";

const appRoutes: Routes = [
  {path: '**', component: AuthComponent}
];
@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule{}
