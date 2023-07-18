import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as Yup from 'yup'

export default function Form () {
    let timer = 1000
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const defaultForm = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        tel: '',
        role: '',
        terms: ''
    }

    const roles = [
        'Professor',
        'Teacher\'s Assistant',
        'Supplemental Instructor',
        'Student',
    ]

    const [formState, setFormState] = useState(defaultForm)
    const [database, setDatabase] = useState({})
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: ''
    })
    const onChange = evt => {
        const name = evt.target.name
        const value = evt.target.value
        setFormState({...formState, [name]: value})
    }
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
            .min(8, 'Password must between 8 and 32 characters long.')
            .max(32, 'Password must be between 8 and 32 characters long.'),
        tel: Yup
            .string()
            .matches(phoneRegExp,'Must be a valid telephone number.')
            .required('Must include telephone number.')

    })

    const setButtonDisabled = () => {
        return !formState.firstName || !formState.lastName || !formState.email || !formState.password
    }

    const formSubmit = e => {
        e.preventDefault()
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
        setDatabase({...database, formState})
        console.log(database)
    }

    const handleKeyPress = () => {
        window.clearTimeout(timer)
    }

    const handleKeyUp = (e) => {
        window.clearTimeout(timer)
        timer = window.setTimeout(handleChange(e), timer)
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
    
    const handleChange = event => {
            Yup
                .reach(formSchema, event.target.name)
                .validate(event.target.value)
                .then(() => {
                    setErrors({
                        ...errors, [event.target.name]: ''
                    })
                })
                .catch(err => {
                    setErrors({
                        ...errors, [event.target.name]: err.errors[0]
                    })
                })
            setFormState({
                ...formState, [event.target.name]: event.target.value
            })
    }

    checkTerms()

    return (
        <div>
            <form onSubmit={formSubmit}>
                <label htmlFor='firstName'>
                    <input 
                        id='firstName'
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
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
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
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
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
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
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
                        name='password'
                        type='password'
                        value={formState.password}
                        onChange={onChange}
                        placeholder='Create Password'
                    />
                </label>
                <label htmlFor='tel'>
                    <input
                        id='tel'
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
                        name='tel'
                        type='tel'
                        value={formState.tel}
                        onChange={onChange}
                        placeholder='Telephone Number'
                    />
                    <small>Format: 123-456-7890</small>
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
            <pre>{JSON.stringify(users, null, 2)}</pre>
            {/* {database.map((entry) => {
                <div className='container'>
                    <h2>Name: {entry.firstName}</h2>
                    <p>Email: {entry.email}</p>
                    <p>Phone Number: {entry.tel}</p>
                    <p>Role: {entry.role}</p>
                </div>
            })} */}
        </div>
    )
}