import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 60px;
  line-height: 60px;
  color: var(--font-color-white);
  .left {
    font-size: var(--ai-font-size-xl);
    padding-left: 40px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 40px;
  }
`
