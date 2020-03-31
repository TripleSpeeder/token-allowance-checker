import React from 'react'
import { Form, Input } from 'semantic-ui-react'

interface AddressInputProps {
    value: string
    loading: boolean
    error: boolean
    success: boolean
    handleInput: (input: string) => void
    mobile: boolean
}

const AddressInput = ({
    handleInput,
    loading,
    error,
    value,
    success,
    mobile,
}: AddressInputProps) => {
    const handleChange = (e: React.FormEvent<EventTarget>) => {
        const { value } = e.target as HTMLInputElement
        handleInput(value)
    }

    if (mobile) {
        return (
            <Form.Field error={error}>
                <label>Enter address/ENS name or change wallet address</label>
                <input
                    onChange={handleChange}
                    placeholder='Eth address or ENS name'
                    value={value}
                />
            </Form.Field>
        )
    } else {
        return (
            <Form.Field inline width={14}>
                <Input
                    placeholder='Address or ENS Name'
                    error={error}
                    loading={loading}
                    onChange={handleChange}
                    value={value}
                    type={'text'}
                    action={{
                        type: 'Submit',
                        disabled: !success,
                        content: 'Go!',
                        positive: true,
                    }}
                    label={'Enter address/ENS name or select in wallet'}
                />
            </Form.Field>
        )
    }
}

export default AddressInput
