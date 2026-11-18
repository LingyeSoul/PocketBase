import{a as e,o as n}from"./index-CDW23nRa.js";import{t as r}from"./expandInfo-2P4WcP0p.js";import{t as i}from"./fieldsInfo-I9iYnvQy.js";import{t as a}from"./filterSyntax-bWqhA66d.js";function o(o){let s=app.utils.getApiExampleURL(),c=o.listRule===null,l={collectionId:o.id,collectionName:o.name},u=[{title:200,value:JSON.stringify({page:1,perPage:30,totalPages:1,totalItems:2,items:[Object.assign(l,app.utils.getDummyFieldsData(o)),Object.assign(l,app.utils.getDummyFieldsData(o))]},null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Something went wrong while processing your request.",
                  "data": {}
                }
            `}];return c&&u.push({title:403,value:`
                {
                  "status": 403,
                  "message": "Only superusers can access this action.",
                  "data": {}
                }
            `}),t.div({pbEvent:`apiPreviewList`,className:`content`},t.p(null,n`Fetch a paginated ${o.name} records list, supporting sorting and filtering.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${s}');

                        ...

                        // fetch a paginated records list
                        const resultList = await pb.collection('${o.name}').getList(1, 50, {
                          filter: 'someField1 != someField2',
                        });

                        // you can also fetch all records at once via getFullList
                        const records = await pb.collection('${o.name}').getFullList({
                          sort: '-someField',
                        });

                        // or fetch only the first record that matches the specified filter
                        const record = await pb.collection('${o.name}').getFirstListItem(
                          'someField="test"',
                          { expand: 'relField1,relField2.subRelField' },
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${s}');

                        ...

                        // fetch a paginated records list
                        final resultList = await pb.collection('${o.name}').getList(
                          page: 1,
                          perPage: 50,
                          filter: 'someField1 != someField2',
                        );

                        // you can also fetch all records at once via getFullList
                        final records = await pb.collection('${o.name}').getFullList(
                          sort: '-someField',
                        );

                        // or fetch only the first record that matches the specified filter
                        final record = await pb.collection('${o.name}').getFirstListItem(
                          'someField="test"',
                          expand: 'relField1,relField2.subRelField',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl \\
                          -H 'Authorization:TOKEN' \\
                          '${s}/api/collections/${o.name}/records?perPage=50'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert info api-preview-alert`},t.span({className:`label method`},`GET`),t.span({className:`path`},`/api/collections/${o.name}/records`),()=>{if(c)return t.small({className:`extra`},e(`Requires superuser Authorization:TOKEN header`))}),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},e(`?query params`)),t.th({className:`min-width`},e(`Type`)),t.th(null,e(`Description`)))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`page`),t.td({className:`min-width`},t.span({className:`label`},e(`Number`))),t.td(null,e(`The page (aka. offset) of the paginated list (default to 1).`))),t.tr(null,t.td({className:`min-width`},`perPage`),t.td({className:`min-width`},t.span({className:`label`},e(`Number`))),t.td(null,e(`Specify the max returned records per page (default to 30).`))),t.tr(null,t.td({className:`min-width`},`sort`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,t.p(null,e(`Specify the records order attribute(s).`),t.br(),e(`Add -/+ (default) in front of the attribute for DESC / ASC order.`)),t.p(null,e(`For example:`),app.components.codeBlock({value:`// DESC by created and ASC by id
?sort=-created,id`})),t.p(null,e(`In addition to the collection non-hidden fields, the following special sort fields could be also used: `),t.code(null,`@random`),` `,t.code({hidden:()=>o.type==`view`},`@rowid`),`.`))),t.tr(null,t.td({className:`min-width`},`filter`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,t.p(null,e(`Filter the returned records. For example:`)),app.components.codeBlock({value:`?filter=(id='abc' && created>'2022-01-01')`,footnote:e(`All query params must be properly URL encoded (the SDKs do this automatically).`)}),a())),t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,r())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},e(`String`))),t.td(null,i())),t.tr(null,t.td({className:`min-width`},`skipTotal`),t.td({className:`min-width`},t.span({className:`label`},e(`Boolean`))),t.td(null,t.p(null,e(`If set to `),t.code(null,`1/true`),e(` the total counts query will be skipped and the response fields `),t.code(null,`totalItems`),e(` and `),t.code(null,`totalPages`),e(` will have -1 value.`)),t.p(null,e(`This could drastically speed up the search queries when the total counters are not needed or cursor based pagination is used.`),e(` For optimization purposes, it is set by default in the `),t.code(null,`getFirstListItem()`),e(` and `),t.code(null,`getFullList()`),e(` SDKs methods.`)))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:u}))}export{o as docsList};