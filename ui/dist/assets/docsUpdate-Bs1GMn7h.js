import{a as e,o as n}from"./index-CDW23nRa.js";import{fullDummyPayload as r,primitivesDummyPayload as i,replaceDummyPayloadPlaceholder as a}from"./docsCreate-DcEzP4pP.js";import{t as o}from"./expandInfo-2P4WcP0p.js";import{t as s}from"./fieldsInfo-I9iYnvQy.js";function c(c){let l=app.utils.getApiExampleURL(),u=c.updateRule===null,d=c.type===`auth`?[`id`,`password`,`verified`,`email`,`emailVisibility`]:[`id`],f=c.fields?.filter(e=>!e.hidden&&e.type!=`autodate`&&!d.includes(e.name))||[],p={collectionId:c.id,collectionName:c.name},m=[{title:200,value:JSON.stringify(Object.assign(p,app.utils.getDummyFieldsData(c)),null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Failed to create record.",
                  "data": {
                    "${f.find(e=>!e.primaryKey)?.name||`someField`}": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}];return u&&m.push({title:403,value:`
                {
                  "status": 403,
                  "message": "Only superusers can perform this action.",
                  "data": {}
                }
            `}),m.push({title:404,value:`
            {
              "status": 404,
              "message": "The requested resource wasn't found.",
              "data": {}
            }
        `}),t.div({pbEvent:`apiPreviewUpdate`,className:`content`},t.p(null,n`Updates an existing ${c.name} record.`),t.p(null,e(`Body parameters could be sent as `),t.code(null,`application/json`),e(` or `),t.code(null,`multipart/form-data`),`.`),t.p(null,e(`File upload is supported only via `),t.code(null,`multipart/form-data`),e(`. For more info and examples you could check the detailed `),t.a({href:`https://pocketbase.io/docs/files-handling`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Files upload and handling docs`)}),`.`),t.p(null,t.em(null,e(`Note that in case of a password change all previously issued tokens for the current record will be automatically invalidated and if you want your user to remain signed in you need to reauthenticate manually after the update call.`))),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
import PocketBase from 'pocketbase';

const pb = new PocketBase('${l}');

...

// example update body
const body = ${a(JSON.stringify(r(c,!0),null,2))};

const record = await pb.collection('${c.name}').update('RECORD_ID', body);
`,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${l}');

...

// example update body
final body = <String, dynamic>${JSON.stringify(i(c,!0),null,2)};

final record = await pb.collection('${c.name}').update(
  'RECORD_ID',
  body: body,
  files: [],
);
`,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl -X PATCH \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ ... }' \\
                          '${l}/api/collections/${c.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert warning api-preview-alert`},t.span({className:`label method`},`PATCH`),t.span({className:`path`},`/api/collections/${c.name}/records/`,t.strong(null,`:id`)),()=>{if(u)return t.small({className:`extra`},e(`Requires superuser Authorization:TOKEN header`))}),t.table({className:`api-preview-table path-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Path params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`id`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`ID of the record to update.`))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,o())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,s())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:m}))}export{c as docsUpdate};