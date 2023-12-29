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
    align-items: center;
    padding-right: 20px;
    .theme-box {
      margin-right: 20px;
      display: flex;
      align-items: center;
      .theme-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .lang-box {
      margin-right: 10px;
      display: flex;
      align-items: center;
      .ant-dropdown-trigger {
        .ant-space {
          display: flex;
          align-items: center;
          .ant-space-item {
            color: var(--font-color-white);
          }
        }
      }
    }
    .github-box {
      cursor: pointer;
    }
    svg {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      display: flex;
    }
  }
`
