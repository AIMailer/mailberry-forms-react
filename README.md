Mailberry Forms library to use together with https://mailberry.ai form builder

## How to use it

### Basic usage

```jsx
  <MailberryForm formId='01HMVBQ5MD2TEPDG73' thanksMessage='Thanks for sub!' format='SNIPPET' formContainerStyles={{backgroundColor: 'aliceblue'}}>
    <MailberryForm.Description>
      <h2 style={{ textAlign: 'center' }}>Hello world!</h2>
      <p>Hola mi mundo!</p>
      <hr />
    </MailberryForm.Description>
    <MailberryForm.EmailInput fieldStyles={{ wrapperStyle: { display: 'flex', flexDirection: 'column' }}} label='Email' required />
    <MailberryForm.TextInput fieldStyles={{ wrapperStyle: { display: 'flex', flexDirection: 'column' }}} label='Last name' required={false} />
    <MailberryForm.NumberInput fieldStyles={{ wrapperStyle: { display: 'flex', flexDirection: 'column' }}} label='Age' required />
    <MailberryForm.Submit buttonStyles={{ backgroundColor: 'aliceblue', fontSize: 14, padding: 12, fontWeight: 700 }} text="Subscribe" />
  </MailberryForm>
```
#### MailberryForm component
The MailberryForm component is the main component of the library. It has the following props:
1. **formId** is the id of the form you want to use
2. **thanksMessage** is the message that will be shown after the form is submitted
3. **format** is the format of the form, it can be 'SNIPPET' or 'POPUP'
4. **formContainerStyles** is the style of the form container
5. **showAt** is the time in seconds that the form will be shown after the page is loaded. If a value number is passed, the poup will be shown after percentage of the page is scrolled. Values allowed 0 - 1, where 0.5 represents 50% of the page scrolled.

Note: 
- MailberryForm format SNIPPET render a form within a div(div form container > form).
- MailberryForm format POPUP it renders a the form within a div three times(div overlay > div modal container > div form container > form).

#### Simple Components
1. **MailberryForm.Description** is a ReactNode and it can be used to add the header and description if you want
2. **MailberryForm.Submit** is a component to add a submit button to the form, has the following props:
    - **text** is the text of the button
    - **submitStyles** is an object with the styles of the submit button. The object has the following keys:
      - **buttonStyles** is the style of the button
      - **buttonWrapperStyles** is the style of the button wrapper. The buttonWrapperStyles is used to wrap the button.

#### Inputs
1. **MailberryForm.EmailInput** is a component to add an email input to the form
2. **MailberryForm.TextInput** is a component to add a text input to the form
3. **MailberryForm.NumberInput** is a component to add a number input to the form
4. **MailberryForm.DateInput** is a component to add a date input to the form
    - **inputStyles** is an object with the styles of the label, input and their wrapper. The object has the following keys:
        - **wrapperStyles** is the style of the input and label wrapper(div > label + input)
        - **labelStyle** is the style of the label
        - **inputStyle** is the style of the input

#### Error Messages
1. **MailberryForm.FieldError** is a component that displays the error message if some of the inputs are invalid.

## Note for the mantainers

In order to use this library in mode local after to make git clone and npm install, follow this steps:
Consider my-app as the project name and my-library as the library name.

1. <code>npm link 'path_to_my-app/node_modules/react'</code> from my-library, to use the same react version and avoid lint errors.
2. Try using it npm pack over npm link, to create a tarball and install it in my-app.
3. Is already to be tested.
4. Every change in my-library needs to be updated rebuilding npm run build, npm pack and then uninstall and install it again in my-app.