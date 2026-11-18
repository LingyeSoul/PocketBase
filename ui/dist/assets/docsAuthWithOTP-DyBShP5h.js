import{a as e}from"./index-CDW23nRa.js";import{t as n}from"./expandInfo-2P4WcP0p.js";import{t as r}from"./fieldsInfo-I9iYnvQy.js";function i(n){let r=app.utils.getApiExampleURL(),i=[{title:e(`OTP request`),content:a},{title:e(`OTP auth`),content:o}],s=store({activeActionIndex:0});return t.div({pbEvent:`apiPreviewAuthWithOTP`,className:`content`},t.p(null,e(`Authenticate with an one-time/short-lived password (OTP).`)),t.p(null,e(`On successful authentication the user will be also marked as verified (if the OTP source is email and the user is not verified already).`)),t.p(null,e(`Note that when requesting an OTP we return an `),t.code(null,`otpId`),e(` even if a user with the provided email doesn't exist as a very basic enumeration protection.`)),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${r}');

                        ...

                        // send OTP email to the provided auth record
                        const req = await pb.collection('${n.name}').requestOTP('test@example.com');

                        // ... show a screen/popup to enter the password from the email ...

                        // authenticate with the requested OTP id and the email password
                        const authData = await pb.collection('${n.name}').authWithOTP(
                            req.otpId,
                            "YOUR_OTP",
                        );

                        // after the above you can also access the auth data from the authStore
                        console.log(pb.authStore.isValid);
                        console.log(pb.authStore.token);
                        console.log(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${r}');

                        ...

                        // send OTP email to the provided auth record
                        final req = await pb.collection('${n.name}').requestOTP('test@example.com');

                        // ... show a screen/popup to enter the password from the email ...

                        // authenticate with the requested OTP id and the email password
                        final authData = await pb.collection('${n.name}').authWithOTP(
                            req.otpId,
                            "YOUR_OTP",
                        );

                        // after the above you can also access the auth data from the authStore
                        print(pb.authStore.isValid);
                        print(pb.authStore.token);
                        print(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        # OTP request (sends email to the user if exists)
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "email":"..." }' \\
                          '${r}/api/collections/${n.name}/request-otp'

                        # OTP auth
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "otpId":"...", "password":"..." }' \\
                          '${r}/api/collections/${n.name}/auth-with-otp'
                    `}]}),t.nav({className:`btns m-t-base m-b-sm`},()=>i.map((e,n)=>t.button({type:`button`,className:()=>`btn sm expanded ${s.activeActionIndex==n?`active`:`secondary`}`,textContent:()=>e.title,onclick:()=>s.activeActionIndex=n}))),()=>i[s.activeActionIndex]?.content?.(n))}function a(n){return[t.div(null,t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/request-otp`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`email `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The auth record email address to send the OTP request (if exists).`))))),t.div({className:`m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:200,value:`
                {
                  "otpId": "njvv1b1lkdbpp3m"
                }
            `},{title:400,value:`
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "email": {
                      "code": "validation_is_email",
                      "message": "Must be a valid email address."
                    }
                  }
                }
            `},{title:429,value:`
                {
                  "status": 429,
                  "message": "You've send too many OTP requests, please try again later.",
                  "data": {}
                }
            `}]})]}function o(i){let a={collectionId:i.id,collectionName:i.name},o=[{title:200,value:JSON.stringify({token:`...JWT...`,record:Object.assign(a,app.utils.getDummyFieldsData(i))},null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Failed to authenticate.",
                  "data": {
                    "otpId": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}];return[t.div(null,t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${i.name}/auth-with-otp`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`otpId `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The id of the OTP request.`))),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The one-time/short-lived password from the OTP request.`))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,n())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())))),t.div({className:`m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:o})]}export{i as docsAuthWithOTP};