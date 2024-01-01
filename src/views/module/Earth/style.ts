import styled from 'styled-components'

export const EarthWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  .loading {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    .loading-text {
      color: #1677ff;
      margin-left: 10px;
    }
  }
  .label {
    color: #fff;
    font-size: 16px;
  }
`
