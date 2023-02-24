
## Example React / .NET 6 C# webapp


##  Create Project

### Frontend

To create the web frontend

```
npx create-react-app web
```

I've made the following modififications:
 * Modify the `src/App.js` file to include styling from `tailwind` and a call to the dotnet api using the excellent `react-query` data fetching library.  In addition, added a proxy section to `package.json` to allow for local development.
 * A the `public/web.config` file, since the files are served by IIS, this file tells IIS to ensure index.html is always returned, and the appropriate filemappings are served.


### API

To create the `dotnet` api

```
mkdir api; cd api
dotnet new webapi
```

When run `dotnet run`, dotnet project exposes a api on `http://localhost:5202/api/WeatherForecast`

I have only added the Authentication library for this app.

Docs : learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-7.0


## Create resources in Azure

Create 2 'WebApp' choosing `.NET 6 runtime`, this will provide a managed `IIS` for both the frontend to server the static assets, and the API


## Build and Deploy the app

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

> ! Note
> The following can be run manually, or added to a CI/CD pipeline


First, we need to get the hostname of the backend API before we build a release, as React variables are resolved at buildtime.  The following command will set the `REACT_APP_API_URL` variable to the backend API hostname

```
export REACT_APP_API_URL="https://$(az webapp show -g <resource-group> -n <api webapp name> --query defaultHostName -o tsv)"
```

Add CORS rules to the backend to allow the frontend origin to call it.

```
az webapp cors add  -g uni-appservice-auth -n dotnet6win  --allowed-origins "https://$(az webapp show -g uni-appservice-auth -n react18win --query defaultHostName -o tsv)"
```

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




