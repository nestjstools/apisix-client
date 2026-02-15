import { Module } from '@nestjs/common';
import { ApisixClientModule } from '../src';

@Module({
  imports: [
    ApisixClientModule.forRoot({
      url: 'http://localhost',
      adminSecret: 'YOUR_ADMIN_SECRET_ENV_PREFERABLE',
      global: true, // optional defaults to true
      prefix: 'admin', // optional defaults `apisix`
      port: 9180, // optional defaults 9180
      //this setup give to use url like http://localhost:9180/apisix
    })
  ]
})
export class AppModule {

}
