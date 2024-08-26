import React, { memo, Suspense, useEffect } from "react"
import { Outlet } from "react-router-dom"
import styled from "styled-components"
import Sidebar from "../components/layouts/private/Sidebar"
import Navbar from "../components/layouts/private/Navbar"
import { useSelector } from "react-redux"
import clsx from "clsx"
import { RootState } from "../store"
import { useDispatch } from "react-redux"
import { setWindowWidth } from "../store/common"
import { Spinner } from "react-bootstrap"
import useProfile from "../hooks/useProfile"

const PrivateLayoutContainer = styled.div`
  width: 100%;
  min-height: 100dvh;
  position: relative;
  display: flex;
`

const SidebarContainer = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;

  @media screen and (min-width: 768px) {
    width: 26rem;
    position: sticky;
    top: 0;
    left: 0;
  }

  &.collapsed {
    width: 0;
    overflow: hidden;

    @media screen and (min-width: 768px) {
      width: 6rem;
    }

    .menu-item-title {
      font-size: 0px;
    }
  }
`

const LayoutContent = styled.div`
  width: 100%;
  height: 100%;
`

const FallbackContainer = styled.div`
  width: 100%;
  height: 85dvh;
  display: grid;
  place-items: center;
`

const PrivateLayout: React.FC = () => {
  const isShowSidebar = useSelector(({ common }: RootState) => common.isShowSidebar)
  const dispatch = useDispatch()
  const { getMyProfile } = useProfile()

  useEffect(() => {
    getMyProfile()
    const resize = () => dispatch(setWindowWidth(window.innerWidth))
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <PrivateLayoutContainer>
      <SidebarContainer className={clsx(!isShowSidebar && 'collapsed')}>
        <Sidebar />
      </SidebarContainer>
      <LayoutContent className="px-0">
        <Navbar/>
        <div className="w-100 p-3 p-md-4">
          <Suspense 
            fallback={(
              <FallbackContainer>
                <Spinner 
                  animation="border"
                  variant="primary"
                />
              </FallbackContainer>
            )}
          >
            <Outlet/>
          </Suspense>
        </div>
      </LayoutContent>
    </PrivateLayoutContainer>
  )
}

export default memo(PrivateLayout)