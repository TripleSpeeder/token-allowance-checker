import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input} from 'semantic-ui-react'

const AddressInput = (props) => {
    const {handleInput, loading, error, value, success} = props

    const handleChange = async (e) => {
        const input=e.target.value
        handleInput(input)
    }

    return (
            <Form.Field
                inline
                width={14}
            >
                <Input
                    placeholder='Address or ENS Name'
                    error={error}
                    loading={loading}
                    onChange={handleChange}
                    value={value}
                    type={'text'}
                    action={{
                        type:'Submit',
                        disabled:!success,
                        content:'Go!',
                        positive:true,
                    }}
                    label={'Enter address/ENS name or select in wallet'}
                />
            </Form.Field>
    )
}

AddressInput.propTypes = {
    value: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    success: PropTypes.bool,
    handleInput: PropTypes.func.isRequired,
}

export default AddressInput
