## Primera instalacion

Crear el .env en el root del projecto (/fiuba-reads) y poner la property REACT_APP_SUPABASE_KEY= con la api key de supabase
hacer npm install
ya con eso vamos a poder correr la app con npm start

## Arq de la app

Dividido en dos partes principales: Auth y Reads. Auth donde tendremos todo lo relacionado con el login y demas.
Tenemos en la raiz del proyecto una carpeta de `components/ui` que menciono a continuacion.


## Componentes UI

Utilizamos la lib [shadcn](https://ui.shadcn.com/docs/components). Para agregar un componente estamos usando la version `0.8.0` ya que la ultima tiene un [bug](https://github.com/shadcn-ui/ui/discussions/4685) para utilizarla con CRA (create react app). Por lo tanto, para agregar un componente debemo ejecutar el siguiente comando en la raiz del proyecto `npx shadcn-ui@0.8.0 add <componente>`. Luego, vamos a ver que dentro de `src` nos creo una carpeta `components/ui` pero el componente que nos agrego debemos pasarlo a la carpeta `components/ui` que esta en la raiz del proyecto. Luego, debemos reemplazar el import `import { cn } from "src/utils"` por este `import { cn } from "../../lib/utils"`.

### Como hacemos para utilizarlo dentro de nuestra page ? 
Importamos los componentes de la siguiente manera:
```js
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
```

Seguimos la siguiente [guia](https://medium.com/@thomas.theiner/enhance-your-create-react-app-with-shadcn-ui-e4e968788124)

Por otro lado, tenemos dentro de `src` la carpeta de `ui/components` que es para poner componentes mas "generales" como es el navbar pero no deben estar ahi aquellos que provienen de la lib.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



