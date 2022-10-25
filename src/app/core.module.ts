import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CustomService } from './custom.service';


@NgModule({
  imports: [HttpClientModule],
  providers: [CustomService]
})
export class CoreModule {}