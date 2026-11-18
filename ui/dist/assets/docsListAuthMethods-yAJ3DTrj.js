import{a as e,o as n}from"./index-CDW23nRa.js";import{t as r}from"./fieldsInfo-I9iYnvQy.js";function i(i){let a=app.utils.getApiExampleURL(),o=store({isLoading:!1,authMethods:[],get responses(){return[{title:200,value:o.isLoading?`...`:JSON.stringify(o.authMethods,null,2)},{title:404,value:`
                        {
                          "status": 404,
                          "message": "Missing collection context.",
                          "data": {}
                        }
                    `}]}});async function s(){o.isLoading=!0;try{o.authMethods=await app.pb.collection(i.name).listAuthMethods(),o.isLoading=!1}catch(e){e?.isAbort||(app.checkApiError(e),o.isLoading=!1)}}return t.div({pbEvent:`apiPreviewListAuthMethods`,className:`content`,onmount:()=>{s()}},t.p(null,n`Returns a public list with all allowed ${i.name} authentication methods.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${a}');

                        ...

                        const result = await pb.collection('${i.name}').listAuthMethods();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${a}');

                        ...

                        final result = await pb.collection('${i.name}').listAuthMethods();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl '${a}/api/collections/${i.name}/auth-methods'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert info api-preview-alert`},t.span({className:`label method`},`GET`),t.span({className:`path`},`/api/collections/${i.name}/auth-methods`)),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:()=>o.responses}))}export{i as docsListAuthMethods};