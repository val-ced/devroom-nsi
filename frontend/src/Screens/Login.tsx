import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetCsrfMutation, useRegisterMutation } from '../redux/api/api'
import { useLoginMutation } from '../redux/api/apiAuth'
import { setCredentials } from '../redux/services/auth/authSlice'

const Login = () => {

  const [csrf] = useGetCsrfMutation()

  useEffect(() => {
    csrf(null)
  }, [])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, set: React.Dispatch<React.SetStateAction<string>>) => {
    set(e.currentTarget.value)
  }

  const dispatch = useDispatch()

  const [atLogin, setAtLogin] = useState("")
  const [passwordLogin, setPasswordLogin] = useState("")

  const [login, { isLoading: isLoadingLogin, error: errorLoading }] = useLoginMutation()

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const creds = await login({ at: atLogin, password: passwordLogin }).unwrap()
    dispatch(setCredentials(creds))
  }

  const [register, { isLoading: isLoadingRegister, error: errorRegister, isSuccess: isSuccessRegister }] = useRegisterMutation()

  const [atRegister, setAtRegister] = useState("")
  const [usernameRegister, setUsernameRegister] = useState("")
  const [passwordRegister, setPasswordRegister] = useState("")
  const [password2Register, setPassword2Register] = useState("")

  const [passwordMatch, setPasswordMatch] = useState(true)

  useEffect(() => {
    if (password2Register === passwordRegister) {
      setPasswordMatch(true)
    } else {
      setPasswordMatch(false)
    }
  }, [passwordRegister, password2Register])

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordMatch) {
      register({ at: atRegister, password: passwordRegister, password2: password2Register, username: usernameRegister }).unwrap()
    }
  }

  return (
    <>
      <div style={{ display: "flex", color: "white" }}>
        <div id="login-form-wrapper">
          <form onSubmit={handleSubmitLogin}>
            <fieldset style={{ display: "flex", flexDirection: "column", padding: "1em" }}>
              <legend>Login</legend>
              <label htmlFor="at">At</label>
              <input name="at" type="text" value={atLogin} onChange={(e) => handleOnChange(e, setAtLogin)} />
              <label htmlFor="password">Password</label>
              <input name="password" type="password" value={passwordLogin} onChange={(e) => handleOnChange(e, setPasswordLogin)} />
              <button type="submit">Submit</button>
            </fieldset>
          </form>
          {isLoadingLogin && <p>Loading</p>}
          {errorLoading && <p>{(errorLoading as any).data.detail}</p>}
        </div>
        <div id="register-form-wrapper">
          <form onSubmit={handleSubmitRegister}>
            <fieldset style={{ display: "flex", flexDirection: "column", padding: "1em" }}>
              <legend>Register</legend>
              <label htmlFor="at">At</label>
              <input name="at" type="text" value={atRegister} onChange={(e) => handleOnChange(e, setAtRegister)} />
              <label htmlFor="username">Username</label>
              <input name="username" type="text" value={usernameRegister} onChange={(e) => handleOnChange(e, setUsernameRegister)} />
              <label htmlFor="password">Password</label>
              <input name="password" type="password" value={passwordRegister} onChange={(e) => handleOnChange(e, setPasswordRegister)} />
              <label htmlFor="password2"> Confirm Password</label>
              <input name="password2" type="password" value={password2Register} onChange={(e) => handleOnChange(e, setPassword2Register)} />
              <button type="submit">Submit</button>
              {isLoadingRegister && <p>Loading</p>}
              {errorRegister && <p>{(errorRegister as any).data.detail}</p>}
              {isSuccessRegister && <p>Account successfully created. Please login.</p>}
            </fieldset>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login