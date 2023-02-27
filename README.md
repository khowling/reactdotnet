
## Example React / .NET 6 C# webapp

Example Application with react SPA frontend, and .NET 6|7 backend API. 

Demonstrates how to provision your app on Windows App Service, and secure your application with Azure Active Directory.


##  Create Project

### Frontend

To create the web frontend (requires node install)

```
npx create-react-app web
```

I've made the following modififications:
 * Modify the `src/App.js` file to include styling from `tailwind` and a call to the dotnet api using the excellent `react-query` data fetching library.  In addition, added a proxy section to `package.json` to allow for local development that routes apis calls.
 * A the `public/web.config` file.  Since the files are served by IIS in Windows App Service, this file tells IIS to ensure index.html is always returned, and the appropriate filemappings are served.


### API

To create the `dotnet` api (requires dotnet install)

```
mkdir api; cd api
dotnet new webapi
```

When run `dotnet run`, dotnet project exposes a api on `http://localhost:5202/api/WeatherForecast`

I have only added the Authentication library for this app.

Docs : learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-7.0


## Create resources in Azure

Create 2 'WebApp' choosing `.NET 6 runtime`, this will provide a managed `IIS` for both the frontend to server the static assets, and the API. You can use the portal `portal.zure.com`, or the `az cli`, or `Visual Studio / Visual Studio Code` tooling. 

### API App
![image](https://user-images.githubusercontent.com/1034202/221536452-a22d01eb-c661-4dfe-8cd8-238d2bba0b5c.png)

### React App (hosted in IIS)
![image](https://user-images.githubusercontent.com/1034202/221536667-4f8462bc-e855-43ba-829f-49264e1f4a0e.png)


## Build and Deploy the app

The following explains how to manually deploy the react and dotnet apps to App Service using the command line `az cli` tool.  This can be incorporated into your preffered CI/CD pipelines.

### Deploy the API

First build a release

```
cd api
dotnet publish -c Release -o ./release
```

Now publish to the webapp, create Zip file of the release assets, and deploy
```
# Create Zip of assets
(cd release && zip -r release.zip *)
az webapp deploy -g <resource-group> -n <webapp name> --src-path ./release.zip
```


### Deploy the React Website


First, we need to get the hostname of the backend API before we build a release, as React variables are resolved at buildtime.  The following command will set the `REACT_APP_API_URL` variable to the backend API hostname

```
export REACT_APP_API_URL="https://$(az webapp show -g <resource-group> -n <api webapp name> --query defaultHostName -o tsv)"
```

 > ! NOTE
 > Add CORS rules to the backend to allow the frontend origin to call it.
 > ```
 > az webapp cors add  -g uni-appservice-auth -n dotnet6win  --allowed-origins "https://$(az webapp show -g uni-appservice-auth -n react18win --query defaultHostName -o tsv)"
 > ```

Now we can build

```
cd web
npm run build
```

Now publish to the webapp, create Zip file of the release assets, and deploy
```
# Create Zip of assets
(cd build && zip -r ../release.zip  *)
az webapp deploy -g <resource-group> -n <webapp name> --src-path ./release.zip
```

## Add Authentiction

We will use the built in `Authentication` feature of App Service, we can enable this, and we will get a AAD app registration that represents this application, but selecting **Add identity provider** with Microsoft - Azure Active Directory





