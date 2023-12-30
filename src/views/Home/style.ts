import styled from 'styled-components'

export const HomeWrapper = styled.div`
  .content {
    overflow: scroll;
    height: calc(100% - 60px);
    padding: 20px 40px;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
  }
`
