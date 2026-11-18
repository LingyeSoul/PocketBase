import{a as e,o as n}from"./index-CDW23nRa.js";import{t as r}from"./expandInfo-2P4WcP0p.js";import{t as i}from"./fieldsInfo-I9iYnvQy.js";import"./filterSyntax-bWqhA66d.js";function a(a){let l=app.utils.getApiExampleURL(),u=a.createRule===null,d=a.type===`auth`,f=d?[`password`,`verified`,`email`,`emailVisibility`]:[],p=a.fields?.filter(e=>!e.hidden&&e.type!=`autodate`&&!f.includes(e.name))||[],m={collectionId:a.id,collectionName:a.name},h=[{title:200,value:JSON.stringify(Object.assign(m,app.utils.getDummyFieldsData(a)),null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Failed to create record.",
                  "data": {
                    "${d?`email`:p.find(e=>!e.primaryKey)?.name||`someField`}": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `}];return u&&h.push({title:403,value:`
                {
                  "status": 403,
                  "message": "Only superusers can perform this action.",
                  "data": {}
                }
            `}),t.div({pbEvent:`apiPreviewCreate`,className:`content`},t.p(null,n`Creates a new ${a.name} record.`),t.p(null,e(`Body parameters could be sent as `),t.code(null,`application/json`),e(` or `),t.code(null,`multipart/form-data`),`.`),t.p(null,e(`File upload is supported only via `),t.code(null,`multipart/form-data`),e(`. For more info and examples you could check the detailed `),t.a({href:`https://pocketbase.io/docs/files-handling`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Files upload and handling docs`)}),`.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
import PocketBase from 'pocketbase';

const pb = new PocketBase('${l}');

...

// example create body
const body = ${o(JSON.stringify(s(a),null,2))};

const record = await pb.collection('${a.name}').create(body);
`+(d?`
// (optional) send an email verification request
await pb.collection('${a?.name}').requestVerification(record.email);
`:``),footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${l}');

...

// example create body
final body = <String, dynamic>${JSON.stringify(c(a),null,2)};

final record = await pb.collection('${a.name}').create(body: body, files: []);
`+(d?`
// (optional) send an email verification request
await pb.collection('${a?.name}').requestVerification(
    record.get<String>('email'),
);
`:``),footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
curl -X POST \\
  -H 'Authorization:TOKEN' \\
  -H 'Content-Type:application/json' \\
  -d '{ ... }' \\
  '${l}/api/collections/${a.name}/records'
`+(d?`
# (optional) send an email verification request
curl -X POST \\
  -H 'Content-Type:application/json' \\
  -d '{ "email":"test@example.com" }' \\
  '${l}/api/collections/${a.name}/request-verification'
`:``)}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${a.name}/records`),()=>{if(u)return t.small({className:`extra`},e(`Requires superuser Authorization:TOKEN header`))}),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`Body params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,()=>{if(d)return[t.tr(null,t.th({colSpan:99},e(`Auth specific fields`))),t.tr(null,t.td({className:`min-width`},`email `,()=>a.fields?.find(e=>e.name==`email`)?.required?t.em(null,e(`(required)`)):t.em(null,e(`(optional)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`Auth record email address.`))),t.tr(null,t.td({className:`min-width`},`emailVisibility `,()=>a.fields?.find(e=>e.name==`emailVisibility`)?.required?t.em(null,e(`(required)`)):t.em(null,e(`(optional)`))),t.td({className:`min-width`},t.span({className:`label`},e(`Boolean`))),t.td(null,e(`Whether to show/hide the auth record email when fetching the record data.`),t.br(),e(`Superusers and the owner of the record always have access to the email address.`))),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`Auth record password.`))),t.tr(null,t.td({className:`min-width`},`passwordConfirm `,t.em(null,e(`(required)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,e(`Auth record password confirmation.`))),t.tr(null,t.td({className:`min-width`},`verified `,t.em(null,e(`(optional)`))),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,t.p(null,e(`Indicates whether the auth record is verified or not.`)),t.p(null,n`This field can be set only by superusers or auth records with "Manage" access.`))),t.tr(null,t.th({colSpan:99},e(`Other fields`)))]},()=>p.map(n=>t.tr(null,t.td({className:`min-width`},n.name,t.em(null,n.required&&!n.autogeneratePattern?` (required)`:` (optional)`)),t.td({className:`min-width`},t.span({className:`label`},()=>{let r=app.fieldTypes[n.type]?.dummyData(n,!0),i=typeof r;return n.type==`file`?e(`File`):i===`string`?e(`String`):i==`number`?e(`Number`):i==`bool`?e(`Boolean`):Array.isArray(r)?`Array`:app.utils.isObject(r)?`Object`:`Mixed`})),t.td(null,t.code(null,n.type),e(` field type value.`),t.br(),t.small({className:`txt-hint`},e(`For more details you could check the `),t.a({href:`https://pocketbase.io/docs/collections/#fields`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Fields docs`)}),`.`)))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,i())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:h}))}function o(e){return e.replaceAll(`"[[`,``).replaceAll(`]]"`,``)}function s(e,n=!1){let r=app.utils.getDummyFieldsData(e,!0);return delete r.id,e.type==`auth`&&(n&&(r.oldPassword=`987654321`,delete r.email),r.password=`123456789`,r.passwordConfirm=`123456789`,delete r.verified),r}function c(e,n=!1){let r=s(e,n);for(let e in r){let n=typeof r[e];(r[e]?.startsWith?.(`[[`)||![`number`,`string`,`boolean`].includes(n)&&!Array.isArray(r[e]))&&delete r[e]}return r}export{a as docsCreate,s as fullDummyPayload,c as primitivesDummyPayload,o as replaceDummyPayloadPlaceholder};