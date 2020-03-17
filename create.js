import uuid from 'uuid';
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export const main = async (event, context ) => {
  //Request body is passed in as a JSON encoded string in 'event.body'
  const noteInfo = JSON.parse(event.body);
  const { content, attachment } = noteInfo;
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Item' contains the attributes of the note to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      notesId: uuid.v1(),
      content,
      attachment,
      createdAt: Date.now()
    }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (error) {
    return failure({ status: false });
  }
};
