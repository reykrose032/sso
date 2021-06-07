import { buildSchema } from '../../utils';
import { UserMongooseModel } from '../../modules/user/model'

import {
    connect,
    clearDatabase,
    closeDatabase,
    populateDatabase,
} from "../utils";
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';

beforeAll(async () => connect());

// beforeEach(async () => {
//     await populateDatabase(UserMongooseModel, [
//         {
//             name: 'Manolo'
//         },
//         {
//             name: 'XDD'
//         }
//     ]);
// });

// afterEach(async () => {
//     await clearDatabase();
// });

afterAll(async (done) => {
    await closeDatabase();
    done();
});

describe('User', () => {
    it(`should create an user`, async () => {
        const graphQLSchema = await buildSchema();

        const server = new ApolloServer({
            schema: graphQLSchema,
        }) as any;

        const { mutate } = createTestClient(server);

        const variables = {
            createUserData: {
                name: `Test name`,
                password: `123`
            },
        };

        const CREATE_USER = gql`
        mutation createUser($createUserData: NewUserInput!) {
            createUser(createUserData: $createUserData) {
                name
            }
        }
        `;

        const res = await mutate({
            mutation: CREATE_USER,
            variables,
        });

        // expect(res.data).toMatchObject({
        //     "createUser": {
        //     "name": "Test name",
        //   }
        // });

        // expect(res.data).toMatchSnapshot({
        //     createUser: {
        //         name: 'Test name'
        //     }
        // });

        expect(res).toMatchSnapshot();
    });

    // it(`should get all users`, async () => {
    //     const graphQLSchema = await buildSchema();

    //     const server = new ApolloServer({
    //         schema: graphQLSchema,
    //     }) as any;

    //     const { query } = createTestClient(server);

    //     const GET_USERS = gql`
    //     query {
    //         getAllUsers {
    //           _id
    //           name
    //         }
    //       }
    //     `;

    //     const res = await query({
    //         query: GET_USERS
    //     });

    //     // expect(res.data).toMatchObject({
    //     //     "users": {
    //     //     "name": "Test name",
    //     //   }
    //     // });

    //     expect(res).toMatchSnapshot();
    // })

    it(`should authenticate`, async () => {
        const graphQLSchema = await buildSchema();

        const server = new ApolloServer({
            schema: graphQLSchema,
        }) as any;

        const { mutate } = createTestClient(server);

        const variables = {
            authenticateData: {
                name: `Test name`,
                password: `123`
            },
        };

        const AUTHENTICATE = gql`
        mutation authenticate($authenticateData: NewUserInput!) {
            authenticate(authenticateData: $authenticateData) {
                _id
                name
                token
            }
        }
        `;

        const res = await mutate({
            mutation: AUTHENTICATE,
            variables,
        });

        expect(res).toMatchSnapshot();
    })

    it(`should not authenticate`, async () => {
        const graphQLSchema = await buildSchema();

        const server = new ApolloServer({
            schema: graphQLSchema,
        }) as any;

        const { mutate } = createTestClient(server);

        const variables = {
            authenticateData: {
                name: `Test name`,
                password: `12345`
            },
        };

        const AUTHENTICATE = gql`
        mutation authenticate($authenticateData: NewUserInput!) {
            authenticate(authenticateData: $authenticateData) {
                _id
                name
                token
            }
        }
        `;

        const res = await mutate({
            mutation: AUTHENTICATE,
            variables,
        });

        expect(res).toMatchSnapshot();
    })
});