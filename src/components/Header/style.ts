import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  height: 60px;
  line-height: 60px;
  color: var(--font-color-white);
  .left {
    font-size: var(--ai-font-size-xl);
    padding-left: 20px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    .ant-dropdown-trigger {
      .ant-space-item {
        color: var(--font-color-white);
      }
    }
  }
`
