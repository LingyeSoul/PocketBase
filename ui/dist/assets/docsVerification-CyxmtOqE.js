import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let o=app.utils.getApiExampleURL(),s=[{title:e(`Request verification`),content:i},{title:e(`Confirm verification`),content:a}],c=store({activeActionIndex:0});return t.div({pbEvent:`apiPreviewVerification`,className:`content`},t.p(null,n`Sends ${r.name} account verification request.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').requestVerification('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        await pb.collection('${r.name}').confirmVerification('VERIFICATION_TOKEN');
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${o}');

                        ...

                        await pb.collection('${r.name}').requestVerification('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        await pb.collection('${r.name}').confirmVerification('VERIFICATION_TOKEN');
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        # Request verification
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "email":"..." }' \\
                          '${o}/api/collections/${r.name}/request-verification'

                        # Confirm verification
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "token":"..." }' \\
                          '${o}/api/collections/${r.name}/confirm-verification'
                    `}]}),t.nav({className:`btns m-t-base m-b-sm`},()=>s.map((e,n)=>t.button({type:`button`,className:()=>`btn sm expanded ${c.activeActionIndex==n?`active`:`secondary`}`,textContent:()=>e.title,onclick:()=>c.activeActionIndex=n}))),()=>s[c.activeActionIndex]?.content?.(r))}function i(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/request-verification`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`email `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The auth record email address to send the verification request (if exists).`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
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
            `}]})]}function a(n){return[t.div({className:`block`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${n.name}/confirm-verification`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`token `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`The token from the verification request email.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
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
            `}]})]}export{r as docsVerification};