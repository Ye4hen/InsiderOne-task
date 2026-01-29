import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DefaultModal from '@/components/ui/DefaultModal.vue'

describe('DefaultModal.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders title, text and actions slots', () => {
    const wrapper = mount(DefaultModal, {
      slots: {
        title: '<span class="slot-title">Confirm</span>',
        text: '<span class="slot-text">Are you sure?</span>',
        actions: '<button id="ok">OK</button>',
      },
    })

    expect(wrapper.find('.slot-title').exists()).toBe(true)
    expect(wrapper.find('.slot-text').exists()).toBe(true)
    expect(wrapper.find('#ok').exists()).toBe(true)
  })

  it('emits "close" when overlay is clicked', async () => {
    const wrapper = mount(DefaultModal, {
      slots: {
        title: 'T',
        text: 'X',
      },
    })

    await wrapper.find('.modal-overlay').trigger('click')
    const emitted = wrapper.emitted('close') || []
    expect(emitted.length).toBe(1)
  })

  it('does NOT emit "close" when clicking inside the modal (dialog) itself', async () => {
    const wrapper = mount(DefaultModal, {
      slots: {
        title: 'T',
        text: 'X',
      },
    })

    await wrapper.find('.modal').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('clicking an action button does not close the modal (action clicks are inside and stopped)', async () => {
    const clickSpy = vi.fn()
    const wrapper = mount(DefaultModal, {
      slots: {
        title: 'T',
        text: 'X',
        actions: '<button id="action">Do</button>',
      },
    })

    const btn = wrapper.find('#action')
    btn.element.addEventListener('click', clickSpy)

    await btn.trigger('click')

    expect(clickSpy).toHaveBeenCalled()

    expect(wrapper.emitted('close')).toBeUndefined()
  })
})
