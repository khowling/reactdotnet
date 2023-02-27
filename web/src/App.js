
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Header />
      <WeatherAPI />
    </QueryClientProvider>
  )
}

function Header() {

  const { isInitialLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ['aadData'],
    queryFn: () =>
      fetch(`/.auth/me`).then(
        (res) => res.json(),
      ),
  })

  return (
    <header class="bg-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
      <a href="#" class="-m-1.5 p-1.5">
        <span class="sr-only">Example App</span>
        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
      </a>
    </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900">
        {!data ?
          isError ? (
            <span>Error: Unable to access authentication information</span>
          ) : isInitialLoading && (
            <span>Loading...</span>
          ) : (
            <span>{data[0].user_claims.find(x => x.typ === 'name').val}</span>
          )}
          
          </a>
      </div>
      </nav>
    </header>
  )
}

function WeatherAPI() {

  const { isInitialLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ['weatherData'],
    enabled: false,
    queryFn: () =>
      fetch(`${process.env.REACT_APP_API_URL ||''}/api/WeatherForecast`, {mode: 'cors', credentials: 'omit'}).then(
        (res) => res.json(),
      ),
  })

  return (
  <main>
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-16 sm:py-32 lg:py-48">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Azure Example</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">React App calling .NET webapi hosted on App Service</p>

          <div className="mt-5 flex items-center justify-center gap-x-6">
           <button disabled={isFetching} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
            onClick={() => refetch()}>{isFetching ? 'Fetching...' : 'Get Latest Weather'}</button>
          </div>
          
          {!data ?
          isError ? (
            <span>Error: {error.message}</span>
          ) : isInitialLoading && (
            <span>Loading...</span>
          ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-5">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3">Date</th>
                      <th scope="col" class="px-6 py-3">Temp (c)</th>
                      <th scope="col" class="px-6 py-3">Summary</th>
                  </tr>
              </thead>
              <tbody>
              {data.map((w, i) => (
                <tr key={i} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{w.date}</th>
                  <td class="px-6 py-4">{w.temperatureC}</td>
                  <td class="px-6 py-4">{w.summary}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  </main>
  );
}

export default App;
