import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from '../StatusBadge.vue'

describe('StatusBadge', () => {
  it('renderiza correctamente el badge con estado PENDIENTE', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'PENDIENTE',
      },
    })

    expect(wrapper.text()).toBe('Pendiente')
    expect(wrapper.classes()).toContain('badge')
    expect(wrapper.classes()).toContain('badge-pending')
  })
})
