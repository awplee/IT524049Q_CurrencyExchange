# Learning Aliyun Function Compute 

This application lets me learn serverless application deployment using Aliyun Function Compute.

## Getting started

### Pre-requisites

* Node.js v16.x.
* request v2.8x.
* date-fns v2.2x.
* Aliyun Serverless Visual Studio Code Extension v1.2x.
* Docker for Visual Studio Code Extenion v1.2x.
* An Aliyun account and activated Function Compute.
* A Fixer account and API key.

### Example

All currency codes must be published on the list of Currency Codes ISO 4217.

E.g. EUR/GBP

Currency pair consists of the base currency and counter currency as shown above. 
The first currency of the example is the base currency while the second one (after the slash) is the counter currency.

### How to use Function Compute and its implementation

Please click the following links for details. 

https://www.alibabacloud.com/help/en/function-compute/latest/how-to-use-function-compute
https://www.alibabacloud.com/help/en/function-compute/latest/activate-function-compute
https://www.alibabacloud.com/help/en/function-compute/latest/create-a-function-in-the-function-compute-console
https://www.alibabacloud.com/help/en/function-compute/latest/use-serverless-devs-to-manage-function-resources
https://www.alibabacloud.com/help/en/function-compute/latest/use-aliyun-serverless-vscode-extension-to-manage-a-function
https://www.alibabacloud.com/help/en/function-compute/latest/permission-management
https://www.alibabacloud.com/help/en/function-compute/latest/use-the-permission-assistant-to-manage-permissions
https://www.alibabacloud.com/help/en/function-compute/latest/grant-function-compute-permissions-to-access-other-alibaba-cloud-services
https://www.alibabacloud.com/help/en/function-compute/latest/grant-an-event-source-permissions-to-access-function-compute
https://www.alibabacloud.com/help/en/function-compute/latest/grant-permissions-to-a-ram-user-by-using-an-alibaba-cloud-account
https://www.alibabacloud.com/help/en/function-compute/latest/grant-permissions-across-alibaba-cloud-accounts-by-using-a-ram-role
https://www.alibabacloud.com/help/en/function-compute/latest/terms
https://www.alibabacloud.com/help/en/function-compute/latest/programming-languages-node-js
https://www.alibabacloud.com/help/en/function-compute/latest/node-request-handler
https://www.alibabacloud.com/help/en/function-compute/latest/node-js-http-functions
https://www.alibabacloud.com/help/en/function-compute/latest/deploy-code-packages
https://www.alibabacloud.com/help/en/function-compute/latest/custom-runtime-overview
https://www.alibabacloud.com/help/en/function-compute/latest/general-faq


```yaml
$ serverless plugin install --name serverless-aliyun-function-compute
```

`serverless.yml`:

```yaml
service: serverless-aliyun-hello-world

provider:
  name: aliyun
  runtime: nodejs8
  credentials: ~/.aliyun_credentials # path must be absolute

plugins:
  - serverless-aliyun-function-compute

package:
  exclude:
    - package-lock.json
    - .gitignore
    - .git/**

functions:
  hello:
    handler: index.hello
    events:
      - http:
          path: /foo
          method: get
```

`package.json`:

```json
{
  "name": "serverless-aliyun-hello-world",
  "version": "0.1.0",
  "description": "Hello World example for aliyun provider with Serverless Framework.",
  "main": "index.js",
  "license": "MIT"
}
```

`index.js`:

```js
'use strict';

exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello!' }),
  };

  callback(null, response);
};
```

In order to deploy this function, we need the credentials with permissions to access Aliyun Function Compute. 
Please create a `credentials` file and configure the credentials in it. 
Here is an example `credentials` file:

```ini
[default]
aliyun_access_key_id = xxxxxxxx
aliyun_access_key_secret = xxxxxxxxxxxxxxxxxxxx
aliyun_account_id = 1234567890
```

You can find the `aliyun_access_key_secret` and `aliyun_access_key_id` from https://ak-console.aliyun.com/?#/accesskey. You can also chose to create an Access Key or use sub-account Access Key.
You can find the `aliyun_account_id` from https://account-intl.console.aliyun.com/?#/secure .
After creating the `credentials` file, please make sure to change the `credentials` field value in `serverless.yml` to the absolute file path.

See [test/project](./test/project) for a more detailed example (including how to access other Aliyun services, how to set up a HTTP POST endpoint, how to set up OSS triggers, etc.).

### Workflow

Make sure that you have activated Function Compute and any other dependent services such as RAM, Log Service, API Gateway and OSS before attempting to deploy your function.

* Deploy your service to Aliyun:

  ```sh
  $ serverless deploy
  ```

  If your service contains HTTP endpoints, you will see the URLs for invoking your functions after a successful deployment.

  Note: you can use `serverless deploy function --function <function name>` to deploy a single function instead of the entire service.
* Invoke a function directly (without going through the API gateway):

  ```sh
  $ serverless invoke --function hello
  ```
* Retrieve the LogHub logs generated by your function:

  ```sh
  $ serverless logs --function hello
  ```
* Get information on your deployed functions

  ```sh
  $ serverless info
  ```
* When you no longer needs your service, you can remove the service, functions, along with deployed endpoints and triggers using:

  ```sh
  $ serverless remove
  ```

  Note: by default RAM roles and policies created during the deployment are not removed. You can use `serverless remove --remove-roles` if you do want to remove them.

#### Change Region

* Changing the region in provider of serverless.yml:
  ```yaml
  provider:
    name: aliyun
    region: cn-hongkong
  ```

* Changing the region in CLI parameters:
  ```sh
  $ serverless deploy --region cn-hongkong
  ```

  Note: CLI parameter `--region` has higher priority than provider, But you have to add this parameter to all the invocations, not only `deploy`.

## Develop

```sh
# clone this repo
git clone git@github.com:aliyun/serverless-aliyun-function-compute.git

# link this module to global node_modules
cd serverless-aliyun-function-compute
npm install
npm link

# try it out by packaging the test project
cd test/project
npm install
npm link serverless-aliyun-function-compute
serverless package
```

## License

MIT
