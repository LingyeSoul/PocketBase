import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let o=app.utils.getApiExampleURL(),s=[{title:e(`Request email change`),content:i},{title:e(`Confirm email change`),content:a}],c=store({activeActionIndex:0});return t.div({pbEvent:`apiPreviewEmailChange`,className:`content`},t.p(null,n`Sends ${r.name} email change request.`),t.p(null,e(`On successful email change all previously issued auth tokens for the specific record will be invalidated (and the user will be marked as verified if not already).`)),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').authWithPassword(
                          'test@example.com',
                          '1234567890'
                        );

                        await pb.collection('${r.name}').requestEmailChange('new@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${r.name}').confirmEmailChange(
                            'EMAIL_CHANGE_TOKEN',
                            'YOUR_PASSWORD',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').authWithPassword(
                          'test@example.com',
                          '1234567890'
                        );

                        await pb.collection('${r.name}').requestEmailChange('new@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${r.name}').confirmEmailChange(
                          'EMAIL_CHANGE_TOKEN',
                          'YOUR_PASSWORD',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        # Request email change
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "newEmail":"..." }' \\
                          '${o}/api/collections/${r.name}/request-email-change'

                        # Confirm email change
                        #
                        # note: all previous user auth tokens will be invalidated
                        # (and the user will be marked as verified if not already)
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "token":"...", "password":"" }' \\
                          '${o}/api/collections/${r.name}/confirm-email-change'
                    `}]}),t.nav({className:`btns m-t-base m-b-sm`},()=>s.map((e,n)=>t.button({type:`button`,className:()=>`btn sm expanded ${c.activeActionIndex==n?`active`:`secondary`}`,textContent:()=>e.title,onclick:()=>c.activeActionIndex=n}))),()=>s[c.activeActionIndex]?.content?.(r))}function i(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/request-email-change`),t.small({className:`extra`},e(`Requires`),t.br(),e(`Authorization:TOKEN header`))),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`newEmail `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The new email address to send the change email request.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "newEmail": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `},{title:401,value:`
                {
                  "status": 401,
                  "message": "The request requires valid record authorization token to be set.",
                  "data": {}
                }
            `},{title:403,value:`
                {
                  "status": 403,
                  "message": "The authorized record model is not allowed to perform this action.",
                  "data": {}
                }
            `}]})]}function a(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/confirm-email-change`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`token `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The token from the change email request email.`))),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The account password to confirm the email change.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "token": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}]})]}export{r as docsEmailChange};