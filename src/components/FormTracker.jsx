import { useState } from 'react'
import { pushToDataLayer } from '../utils/gtm'

function FormTracker() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Відстеження змін у формі
    pushToDataLayer({
      event: 'form_interaction',
      form_id: 'contact_form',
      form_name: 'Контактна форма',
      field_name: name,
      field_value: value.substring(0, 50) // Обмежуємо довжину для приватності
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    pushToDataLayer({
      event: 'form_submit',
      form_id: 'contact_form',
      form_name: 'Контактна форма',
      form_destination: '/api/contact'
    })

    alert('Форма відправлена! (симуляція)')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="form-tracker">
      <h3>Відстеження форми</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Ім'я:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Повідомлення:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </label>
        </div>
        <button type="submit">Відправити</button>
      </form>
    </div>
  )
}

export default FormTracker
