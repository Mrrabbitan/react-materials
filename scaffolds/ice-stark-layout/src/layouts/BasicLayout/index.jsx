/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { useState, useEffect } from 'react';
import Shell from '@alifd/shell';
import { enquire } from 'enquire-js';
import { Icon, Nav } from '@alifd/next';
import { Link } from 'react-router-dom';
import PathnameContext from '@/context/PathnameContext';
import { headerMenuConfig } from '@/config/menu';
import { userProfile } from '@/config/dataSource';
import request from '@/utils/request';

import Logo from './components/Logo';
import AsideNav from './components/AsideNav';
import AsideLocalNav from './components/AsideLocalNav';
import Footer from './components/Footer';

import styles from './index.module.scss';

const BasicLayout = (props) => {
  const [pathname, setPathname] = useState();
  const [isScreen, setIsScreen] = useState();

  function enquireScreenHandle(type) {
    const handler = {
      match: () => {
        setIsScreen(type);
      },
    };

    return handler;
  }

  /**
   * 注册监听屏幕的变化，可根据不同分辨率做对应的处理
   */
  function enquireScreenRegister() {
    const isMobile = 'screen and (max-width: 720px)';
    const isTablet = 'screen and (min-width: 721px) and (max-width: 1199px)';
    const isDesktop = 'screen and (min-width: 1200px)';

    enquire.register(isMobile, enquireScreenHandle('isMobile'));
    enquire.register(isTablet, enquireScreenHandle('isTablet'));
    enquire.register(isDesktop, enquireScreenHandle('isDesktop'));
  }

  useEffect(() => {
    enquireScreenRegister();
  }, []);

  const isMobile = isScreen !== 'isDesktop';

  // header
  const [userinfo, setUserinfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await request(userProfile);
        const { name, avatar } = data.data;
        await setUserinfo({ name, avatar });
      } catch (err) {
        await setUserinfo({});
      }
    }
    fetchData();
  }, []);

  const { name, avatar } = userinfo;

  return (
    <Shell className={styles.shell} device={isMobile ? 'phone' : 'desktop'}>
      <Shell.Branding>
        <Logo />
        <span className={styles.appName}>ICE Stark</span>
      </Shell.Branding>
      <Shell.Navigation direction="hoz">
        {headerMenuConfig && headerMenuConfig.length > 0 ? (
          <Nav direction="hoz" type="secondary" selectedKeys={[]}>
            {headerMenuConfig.map((nav, idx) => {
              const linkProps = {};
              if (nav.newWindow) {
                linkProps.href = nav.path;
                linkProps.target = '_blank';
              } else if (nav.external) {
                linkProps.href = nav.path;
              } else {
                linkProps.to = nav.path;
              }
              return (
                <Nav.Item key={idx} icon={nav.icon ? nav.icon : null}>
                  {linkProps.to ? (
                    <Link {...linkProps}>{!isMobile ? nav.name : null}</Link>
                  ) : (
                    <a {...linkProps}>{!isMobile ? nav.name : null}</a>
                  )}
                </Nav.Item>
              );
            })}
          </Nav>
        ) : null}
      </Shell.Navigation>
      <Shell.Action>
        <img src={avatar} className={styles.avatar} alt="avatar" />
        <span className={styles.userName}>{name}</span>
      </Shell.Action>

      <Shell.Navigation>
        <AsideNav pathname={pathname} />
      </Shell.Navigation>

      <Shell.LocalNavigation>
        <AsideLocalNav />
      </Shell.LocalNavigation>

      <Shell.Content>
        <PathnameContext.Provider value={{ pathname, setPathname }}>
          {props.children}
        </PathnameContext.Provider>
      </Shell.Content>

      <Shell.Footer>
        <Footer />
      </Shell.Footer>

      <Shell.Ancillary />

      <Shell.ToolDock>
        <Shell.ToolDockItem>
          <Icon type="search" />
        </Shell.ToolDockItem>
        <Shell.ToolDockItem>
          <Icon type="calendar" />
        </Shell.ToolDockItem>
        <Shell.ToolDockItem>
          <Icon type="atm" />
        </Shell.ToolDockItem>
        <Shell.ToolDockItem>
          <Icon type="account" />
        </Shell.ToolDockItem>
      </Shell.ToolDock>
    </Shell>
  );
};

export default BasicLayout;
