import{a as e,o as n}from"./index-CDW23nRa.js";import{t as r}from"./expandInfo-2P4WcP0p.js";import{t as i}from"./fieldsInfo-I9iYnvQy.js";function a(a){let o=app.utils.getApiExampleURL(),s=a.viewRule===null,c={collectionId:a.id,collectionName:a.name},l=[{title:200,value:JSON.stringify(Object.assign(c,app.utils.getDummyFieldsData(a)),null,2)}];return s&&l.push({title:403,value:`
                {
                  "status": 403,
                  "message": "Only superusers can access this action.",
                  "data": {}
                }
            `}),l.push({title:404,value:`
            {
              "status": 404,
              "message": "The requested resource wasn't found.",
              "data": {}
            }
        `}),t.div({pbEvent:`apiPreviewView`,className:`content`},t.p(null,n`Fetch a single ${a.name} record.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${o}');

                        ...

                        const record = await pb.collection('${a.name}').getOne('RECORD_ID', {
                            expand: 'relField1,relField2.subRelField',
                        });
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${o}');

                        ...

                        final record = await pb.collection('${a.name}').getOne('RECORD_ID',
                          expand: 'relField1,relField2.subRelField',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl \\
                          -H 'Authorization:TOKEN' \\
                          '${o}/api/collections/${a.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert info api-preview-alert`},t.span({className:`label method`},`GET`),t.span({className:`path`},`/api/collections/${a.name}/records/`,t.strong(null,`:id`)),()=>{if(s)return t.small({className:`extra`},e(`Requires superuser Authorization:TOKEN header`))}),t.table({className:`api-preview-table path-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Path params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`id`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`ID of the record to view.`))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,i())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:l}))}export{a as docsView};