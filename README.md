Mailberry Forms library to use together with https://mailberry.ai form builder 

In order to use this library in mode local after to make git clone and npm install, follow this steps:
Consider my-app as the project name and my-library as the library name.

1. <code>npm link 'path_to_my-app/node_modules/react'</code> from my-library, to use the same react version and avoid lint errors.
2. Try using it npm pack over npm link, to create a tarball and install it in my-app.
3. Is already to be tested.