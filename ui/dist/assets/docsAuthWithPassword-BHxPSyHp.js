import{a as e}from"./index-CDW23nRa.js";import{t as n}from"./expandInfo-2P4WcP0p.js";import{t as r}from"./fieldsInfo-I9iYnvQy.js";function i(i){let a=app.utils.getApiExampleURL(),o=i.passwordAuth?.identityFields||[],s=o.length==0?`NONE`:`YOUR_`+o.join(`_OR_`).toUpperCase(),c={collectionId:i.id,collectionName:i.name},l=[{title:200,value:JSON.stringify({token:`...JWT...`,record:Object.assign(c,app.utils.getDummyFieldsData(i))},null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Failed to authenticate.",
                  "data": {
                    "identity": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}];return t.div({pbEvent:`apiPreviewAuthWithPassword`,className:`content`},t.p(null,e(`Authenticate with combination of `),t.strong(null,o.join(`/`)),e(` and `),t.strong(null,`password`),`.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${a}');

                        ...

                        const authData = await pb.collection('${i.name}').authWithPassword(
                          '${s}',
                          'YOUR_PASSWORD',
                        );

                        // after the above you can also access the auth data from the authStore
                        console.log(pb.authStore.isValid);
                        console.log(pb.authStore.token);
                        console.log(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${a}');

                        ...

                        final authData = await pb.collection('${i.name}').authWithPassword(
                          '${s}',
                          'YOUR_PASSWORD',
                        );

                        // after the above you can also access the auth data from the authStore
                        print(pb.authStore.isValid);
                        print(pb.authStore.token);
                        print(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "identity":"${s}", "password":"YOUR_PASSWORD" }' \\
                          '${a}/api/collections/${i.name}/auth-with-password'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${i.name}/auth-with-password`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`identity `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,app.utils.sentenize(o.join(e(` or `)),!1),e(` of the record to authenticate.`))),t.tr(null,t.td({className:`min-width`},`identityField `,t.em(null,e(`(optional)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`In case of multiple identity fields, explicitly set the field name to use when searching for the auth record.`),t.br(),e(`Leave it empty for auto detection.`))),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The auth record password.`))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,n())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:l}))}export{i as docsAuthWithPassword};