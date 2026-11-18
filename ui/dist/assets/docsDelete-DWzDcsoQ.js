import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let i=app.utils.getApiExampleURL(),a=r.deleteRule===null,o=[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "Failed to delete record. Make sure that the record is not part of a required relation reference.",
                  "data": {}
                }
            `}];return a&&o.push({title:403,value:`
                {
                  "status": 403,
                  "message": "Only superusers can access this action.",
                  "data": {}
                }
            `}),o.push({title:404,value:`
            {
              "status": 404,
              "message": "The requested resource wasn't found.",
              "data": {}
            }
        `}),t.div({pbEvent:`apiPreviewDelete`,className:`content`},t.p(null,n`Delete a single ${r.name} record.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${i}');

                        ...

                        await pb.collection('${r.name}').delete('RECORD_ID');
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${i}');

                        ...

                        await pb.collection('${r.name}').delete('RECORD_ID');
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl -X DELETE \\
                          -H 'Authorization:TOKEN' \\
                          '${i}/api/collections/${r.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert danger api-preview-alert`},t.span({className:`label method`},`DELETE`),t.span({className:`path`},`/api/collections/${r.name}/records/`,t.strong(null,`:id`)),()=>{if(a)return t.small({className:`extra`},e(`Requires superuser Authorization:TOKEN header`))}),t.table({className:`api-preview-table path-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Path params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`id`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`ID of the record to delete.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:o}))}export{r as docsDelete};