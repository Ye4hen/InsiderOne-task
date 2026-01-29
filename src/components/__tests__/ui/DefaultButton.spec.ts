import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DefaultButton from '@/components/ui/DefaultButton.vue'

describe('Button', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders slot content', () => {
    const wrapper = mount(DefaultButton, {
      slots: { default: 'Click me' },
    })

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.classes()).toEqual(['button', 'button--primary'])
    expect(btn.text()).toBe('Click me')
  })

  it.each(['primary', 'secondary', 'danger', 'warning'] as const)(
    'applies base and variant classes for design=%s',
    (design) => {
      const wrapper = mount(DefaultButton, {
        props: { design },
      })

      const btn = wrapper.find('button')
      expect(btn.exists()).toBe(true)
      expect(btn.classes()).toContain('button')
      expect(btn.classes()).toContain(`button--${design}`)
    },
  )

  it('forwards attributes to the native button element (disabled, id, aria-label)', () => {
    const wrapper = mount(DefaultButton, {
      props: { design: 'primary' },
      attrs: {
        id: 'my-btn',
        'aria-label': 'my-button',
        disabled: true,
      },
    })

    const btn = wrapper.find('button')
    expect(btn.attributes('id')).toBe('my-btn')
    expect(btn.attributes('aria-label')).toBe('my-button')
    expect(btn.attributes()).toHaveProperty('disabled')
  })

  it('forwards click listeners to the native button (click handler is called)', async () => {
    const onClick = vi.fn()
    const wrapper = mount(DefaultButton, {
      props: { design: 'primary' },
      attrs: {
        onClick,
      },
    })

    const btn = wrapper.find('button')
    await btn.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
