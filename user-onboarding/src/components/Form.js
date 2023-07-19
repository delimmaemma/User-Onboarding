import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as Yup from 'yup'

import { countryCodes } from '../Data'
import { defaultForm } from '../Data'
import { roles } from '../Data'

export default function Form () {

    const [formState, setFormState] = useState(defaultForm)
    const [database, setDatabase] = useState([{}])
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        tel: '',
        terms: ''
    })

    const checkTerms = () => {
        if (formState.terms === 'on') {setFormState({...formState, terms: true})}
        else if (formState.terms === '') {setFormState({...formState, terms: false})}
    }
    
    const formSchema = Yup.object().shape({
        firstName: Yup
            .string()
            .required('Must include a first name.'),
        lastName: Yup
            .string()
            .required('Must include a last name.'),
        email: Yup
            .string()
            .email('Must be a valid email address.')
            .required('Must include email address.'),
        password: Yup
            .string()
            .required('Password is required')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters, one uppercase, one number and one special case character"
              ),
        tel: Yup
            .string()
            .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Must be valid phone number.')
            .required('Must include telephone number.')
    })

    const setButtonDisabled = () => {
        if(formState.tel.length >= 10) return !formState.firstName || !formState.lastName || !formState.email || !formState.password
        else return true
    }

    const formSubmit = e => {
        e.preventDefault()
        setDatabase(database.concat({Name: `${formState.firstName} ${formState.lastName}`, Email: formState.email, Code: formState.code, Phone: formState.tel, Role: formState.role, Image: formState.myImage}))
        console.log('Submitted!')
        axios
            .post(`https://reqres.in/api/users`, formState)
            .then(res => {
                setUsers(res.data)
                console.log('success ', res)
            })
            .catch(err => {
                console.log(err.response)
            })
        setFormState(defaultForm)
    }
    
    useEffect(() => {
        formSchema.validate(formState)
            .then((valid) => {
                console.log('Form is valid!')
                setButtonDisabled(!valid)
            })
            .catch((err) => {
                console.error(err.errors)
            })
    }, [formState])
    
    const onChange = evt => {
        const name = evt.target.name
        const value = evt.target.value
        Yup
                .reach(formSchema, name)
                .validate(value)
                .then(() => {
                    setErrors({
                        ...errors, [name]: ''
                    })
                })
                .catch(err => {
                    setErrors({
                        ...errors, [name]: err.errors[0]
                    })
                })
        setFormState({
            ...formState, [name]: value
        })
    }

    return (
        <div>
            <form className='container' onSubmit={formSubmit}>
                <label htmlFor='firstName'>
                    <input 
                        id='firstName'
                        name="firstName"
                        type="text"
                        value={formState.firstName}
                        onChange={onChange}
                        placeholder="First Name"
                    />
                </label>
                {errors.firstName.length > 0 && <p className='error'>{errors.firstName}</p>}
                <label htmlFor='lastName'>
                    <input
                        id='lastName'
                        name='lastName'
                        type='text'
                        value={formState.lastName}
                        onChange={onChange}
                        placeholder='Last Name'
                    />
                </label>
                {errors.lastName.length > 0 && <p className='error'>{errors.lastName}</p>}
                <label htmlFor='email'>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={formState.email}
                        onChange={onChange}
                        placeholder='Email'
                    />
                </label>
                {errors.email.length > 0 && <p className='error'>{errors.email}</p>}
                <label htmlFor='password'>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={formState.password}
                        onChange={onChange}
                        placeholder='Create Password'
                    />
                </label>
                <label htmlFor='tel'>
                    <select id='code'
                        onChange={event => setFormState({...formState, code: event.target.value})}
                        defaultValue={formState.code}>
                            <option> --- Select Country --- </option>
                            {countryCodes.map((cntry, idx) =>
                                <option key={idx} value={cntry.countryCodes}>{cntry.country} +{cntry.countryCodes}</option>)}
                        </select>
                    <input
                        id='tel'
                        name='tel'
                        type='tel'
                        value={formState.tel}
                        onChange={onChange}
                        placeholder='Telephone Number'
                    />
                </label>
                {errors.password.length > 0 && <p className='error'>{errors.password}</p>}
                <label htmlFor='role'>
                    <select id='role' 
                        onChange={event => setFormState({...formState, role: event.target.value})} 
                        defaultValue={formState.role}>
                            <option> --- Select Role ---</option>
                            {roles.map((role, idx) => 
                                <option key = {idx} value = {role}>{role}</option>
                            )}
                    </select>
                </label>
                <label htmlFor='pfp'>
                <input 
                    type="file" 
                    name="myImage" 
                    accept="image/*" 
                    onChange={evt => setFormState({...formState, myImage: evt.target.value})}
                />
                </label>
                <label htmlFor='tos'>
                    <input
                        className='checkbox'
                        id='tos'
                        onChange={checkTerms}
                        name='terms'
                        type='checkbox'
                    />
                    I agree to the Terms of Service
                </label>
                <input
                    type='submit'
                    disabled={setButtonDisabled()}
                />
            </form>
            {database.map((entry, idx) => 
                entry.Name && <div className='container' key={idx}>
                    <h2>Name: {entry.Name}</h2>
                    <p>Email: {entry.Email}</p>
                    <p>Phone Number: {`+${entry.Code} ${entry.Phone.slice(0,3)}-${entry.Phone.slice(3,6)}-${entry.Phone.slice(6)}`}</p>
                    <p>Role: {entry.Role}</p>
                    {entry.myImage && <img src={`${entry.myImage}`}></img>}
                    <button key={idx}>Remove</button>
                </div>
            )}
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    )
}