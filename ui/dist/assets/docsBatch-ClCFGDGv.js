import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let i=app.utils.getApiExampleURL(),a={collectionId:r.id,collectionName:r.name},o=[{title:200,value:JSON.stringify([{status:200,body:Object.assign(a,app.utils.getDummyFieldsData(r))},{status:200,body:Object.assign(a,app.utils.getDummyFieldsData(r))}],null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "Batch transaction failed.",
                  "data": {
                    "requests": {
                      "1": {
                        "code": "batch_request_failed",
                        "message": "Batch request failed.",
                        "response": {
                          "status": 400,
                          "message": "Failed to create record.",
                          "data": {
                            "id": {
                              "code": "validation_min_text_constraint",
                              "message": "Must be at least 3 character(s).",
                              "params": { "min": 3 }
                            }
                          }
                        }
                      }
                    }
                  }
                }
            `},{title:403,value:`
                {
                  "status": 403,
                  "message": "Batch requests are not allowed.",
                  "data": {}
                }
            `}];return t.div({pbEvent:`apiPreviewBatch`,className:`content`},t.p(null,n`Batch and transactional create/update/upsert/delete of multiple records in a single request.`),t.div({className:`alert warning`},t.p({className:`txt-bold`},e(`The batch Web API need to be explicitly enabled and configured from the `),t.a({href:`#/settings`,target:`_blank`,title:e(`Open in new tab`),textContent:e(`App settings`)}),`.`),t.p(null,e(`Because this endpoint process the requests in a single DB transaction it could degrade the performance of your application if not used with proper care and configuration (use smaller max processing and body size limits, avoid large file uploads over slow S3 networks and custom hooks that communicate with slow external APIs).`))),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${i}');

                        ...

                        const batch = pb.createBatch();

                        batch.collection('${r.name}').create({ ... });
                        batch.collection('${r.name}').update('RECORD_ID', { ... });
                        batch.collection('${r.name}').delete('RECORD_ID');
                        batch.collection('${r.name}').upsert({ ... });

                        const result = await batch.send();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${i}');

                        ...

                        final batch = pb.createBatch();

                        batch.collection('${r.name}').create(body: { ... });
                        batch.collection('${r.name}').update('RECORD_ID', body: { ... });
                        batch.collection('${r.name}').delete('RECORD_ID');
                        batch.collection('${r.name}').upsert(body: { ... });

                        final result = await batch.send();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "requests": [...] }' \\
                          '${i}/api/batch'
                    `}]}),t.div({className:`block m-t-sm`},t.strong(null,e(`API details`))),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/batch`)),t.p(null,e(`The request accepts only 1 required `),t.code(null,`requests: Array<Request>`),e(` parameter that defines the list of the batch requests to process.`)),t.p(null,e(`When using the official SDKs the batch requests are transparently constructed by their service handler.`)),t.p(null,e(`For the cases when you don't use the SDKs, the she supported batch request actions are:`)),t.ul(null,t.li(null,e(`record create - `),t.code(null,`POST /api/collections/{collection}/records`)),t.li(null,e(`record update - `),t.code(null,`PATCH /api/collections/{collection}/records`)),t.li(null,e(`record upsert - `),t.code(null,`PUT /api/collections/{collection}/records`),t.br(),t.small({className:`txt-hint`},`(the body must have an "id" field)`)),t.li(null,e(`record delete - `),t.code(null,`DELETE /api/collections/{collection}/records/{id}`))),t.p(null,e(`Each batch `),t.em(null,`Request`),e(` element has the following properties:`)),t.ul(null,t.li(null,t.code(null,`url`),t.em(null,` (could include query parameters)`)),t.li(null,t.code(null,`method`),t.em(null,` (GET, POST, PUT, PATCH, DELETE)`)),t.li(null,t.code(null,`headers`),t.br(),t.em(null,`(custom per-request Authorization header is not supported at the moment, aka. all batch requests have the same auth state)`)),t.li(null,t.code(null,`body`),t.br(),e(`When the batch request is send as `),t.code(null,`multipart/form-data`),e(`, the regular batch action fields are expected to be submitted as serialized json under the `),t.code(null,`@jsonPayload`),e(` field and file keys need to follow the pattern `),t.code(null,`requests.N.fileField`),e(` or `),t.code(null,`requests[N].fileField`),`.`,t.br(),e(`Again this is handled transparently by the official SDKs, but for example if you prefer to manually construct a JS `),t.code(null,`FormData`),e(` body, then it could look something like:`),app.components.codeBlock({className:`m-t-10`,value:`
                        const batchBody = new FormData();

                        batchBody.append("@jsonPayload", JSON.stringify({
                          requests: [
                            // create
                            {
                              url: "/api/collections/users/records?expand=someRelField",
                              method: "POST",
                              body: { someField: "test1" }
                            },
                            // update
                            {
                              url: "/api/collections/users/records/RECORD_ID",
                              method: "PATCH",
                              body: { someField: "test2" }
                            }
                          ]
                        }))

                        // bind file to the first request
                        batchBody.append("requests.0.someFileField", new File(...))

                        // bind file to the second request
                        batchBody.append("requests.1.someFileField", new File(...))
                    `}))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Example responses`))),app.components.codeBlockTabs({tabs:o}))}export{r as docsBatch};