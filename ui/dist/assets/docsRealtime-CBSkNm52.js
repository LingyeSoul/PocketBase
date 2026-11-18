import{a as e,o as n}from"./index-CDW23nRa.js";function r(r){let i=app.utils.getApiExampleURL(),a=Object.assign({collectionId:r.id,collectionName:r.name},app.utils.getDummyFieldsData(r));return t.div({pbEvent:`apiPreviewRealtime`,className:`content`},t.p(null,n`Subscribe to realtime changes via Server-Sent Events (SSE).`),t.p(null,e(`Events are sent for `),t.strong(null,`create`),e(`, `),t.strong(null,`update`),e(` and `),t.strong(null,`delete`),n` record operations (see "Event data format" below).`),t.div({className:`alert info`},t.p({className:`txt-bold`},e(`You could subscribe to a single record or to an entire collection.`)),t.p(null,e(`When you subscribe to a `),t.strong(null,e(`single record`)),e(`, the collection's `),t.strong(null,e(`View rule`)),e(` will be used to determine whether the subscriber is allowed to receive the event message.`)),t.p(null,e(`When you subscribe to an `),t.strong(null,e(`entire collection`)),e(`, the collection's `),t.strong(null,e(`List/Search rule`)),e(` will be used to determine whether the subscriber is allowed to receive the event message.`))),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${i}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${r.name} record
                        pb.collection('${r.name}').subscribe('*', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        // subscribe to changes only in the specified record
                        pb.collection('${r.name}').subscribe('RECORD_ID', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${r.name}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${r.name}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${r.name}').unsubscribe();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`JS SDK docs`)}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${i}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${r.name} record
                        pb.collection('${r.name}').subscribe('*', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        // subscribe to changes only in the specified record
                        pb.collection('${r.name}').subscribe('RECORD_ID', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${r.name}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${r.name}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${r.name}').unsubscribe();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://ganigeorgiev.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Dart SDK docs`)}))},{title:`curl`,language:`bash`,value:`
                        # init an SSE connection and start listening for messages
                        # (the first message is always PB_CONNECT with the connection "clientId")
                        curl -N '${i}/api/realtime'

                        # open a new terminal and submit the subscription topic(s)
                        # with the "clientId" from the initial PB_CONNECT message
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "clientId": "YOUR_CLIENT_ID", "subscriptions": ["${r.name}/*"] }' \\
                          '${i}/api/realtime'

                        # create/update/delete a record in the ${r.name} collection and
                        # you should see the event message(s) in the first terminal
                        # (as long as your client satisfies the topic API rule)
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,e(`API details`))),t.div({className:`alert api-preview-alert`},t.span({className:`label method`},`GET/POST`),t.span({className:`path`},`/api/realtime`),t.div({className:`extra`},t.a({href:`https://pocketbase.io/docs/api-realtime/`,target:`_blank`,rel:`noopener noreferrer`,textContent:e(`Realtime docs`)}))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,e(`Event data format`))),app.components.codeBlock({value:JSON.stringify({action:`create`,record:a},null,2).replace(`"action": "create",`,`"action": "create", // create, update or delete`)}))}export{r as docsRealtime};