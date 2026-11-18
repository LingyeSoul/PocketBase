import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let o=app.utils.getApiExampleURL(),s=[{title:e(`Request password reset`),content:i},{title:e(`Confirm password reset`),content:a}],c=store({activeActionIndex:0});return t.div({pbEvent:`apiPreviewPasswordReset`,className:`content`},t.p(null,n`Sends ${r.name} password reset email request.`),t.p(null,e(`On successful password reset all previously issued auth tokens for the specific record will be invalidated (and the user will be marked as verified if not already).`)),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').requestPasswordReset('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${r.name}').confirmPasswordReset(
                            'RESET_TOKEN',
                            'NEW_PASSWORD',
                            'NEW_PASSWORD_CONFIRM',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').requestPasswordReset('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${r.name}').confirmPasswordReset(
                          'RESET_TOKEN',
                          'NEW_PASSWORD',
                          'NEW_PASSWORD_CONFIRM',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        # Request password reset
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "email":"..." }' \\
                          '${o}/api/collections/${r.name}/request-password-reset'

                        # Confirm password reset
                        #
                        # note: all previous user auth tokens will be invalidated
                        # (and the user will be marked as verified if not already)
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "token":"...", "password":"", "passwordConfirm":"" }' \\
                          '${o}/api/collections/${r.name}/confirm-password-reset'
                    `}]}),t.nav({className:`btns m-t-base m-b-sm`},()=>s.map((e,n)=>t.button({type:`button`,className:()=>`btn sm expanded ${c.activeActionIndex==n?`active`:`secondary`}`,textContent:()=>e.title,onclick:()=>c.activeActionIndex=n}))),()=>s[c.activeActionIndex]?.content?.(r))}function i(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/request-password-reset`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`email `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The auth record email address to send the password reset request (if exists).`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "email": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}]})]}function a(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/confirm-password-reset`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`token `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The token from the password reset request email.`))),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The new password to set.`))),t.tr(null,t.td({className:`min-width`},`passwordConfirm `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`Confirmation of the new password.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
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
            `}]})]}export{r as docsPasswordReset};