import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/2019/11/17/first-blog',
    component: ComponentCreator('/2019/11/17/first-blog', 'd5b'),
    exact: true
  },
  {
    path: '/2020/01/29/second-blog',
    component: ComponentCreator('/2020/01/29/second-blog', 'bc3'),
    exact: true
  },
  {
    path: '/2020/01/30/third-blog',
    component: ComponentCreator('/2020/01/30/third-blog', 'f06'),
    exact: true
  },
  {
    path: '/2024/10/26/sixth-terrform-aks',
    component: ComponentCreator('/2024/10/26/sixth-terrform-aks', 'e60'),
    exact: true
  },
  {
    path: '/2024/11/01/fifth-Redis-cluster',
    component: ComponentCreator('/2024/11/01/fifth-Redis-cluster', '307'),
    exact: true
  },
  {
    path: '/2024/12/18/forth-prometheus',
    component: ComponentCreator('/2024/12/18/forth-prometheus', 'c30'),
    exact: true
  },
  {
    path: '/archive',
    component: ComponentCreator('/archive', '51a'),
    exact: true
  },
  {
    path: '/authors',
    component: ComponentCreator('/authors', '498'),
    exact: true
  },
  {
    path: '/authors/hansgun',
    component: ComponentCreator('/authors/hansgun', '56e'),
    exact: true
  },
  {
    path: '/helllo_world',
    component: ComponentCreator('/helllo_world', 'ead'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/tags',
    component: ComponentCreator('/tags', '626'),
    exact: true
  },
  {
    path: '/tags/authorizer',
    component: ComponentCreator('/tags/authorizer', 'b79'),
    exact: true
  },
  {
    path: '/tags/ci-cd',
    component: ComponentCreator('/tags/ci-cd', '334'),
    exact: true
  },
  {
    path: '/tags/dev',
    component: ComponentCreator('/tags/dev', '0f8'),
    exact: true
  },
  {
    path: '/tags/docker-compose',
    component: ComponentCreator('/tags/docker-compose', '350'),
    exact: true
  },
  {
    path: '/tags/jenkins',
    component: ComponentCreator('/tags/jenkins', '443'),
    exact: true
  },
  {
    path: '/tags/kubernetes',
    component: ComponentCreator('/tags/kubernetes', '0cc'),
    exact: true
  },
  {
    path: '/tags/loki',
    component: ComponentCreator('/tags/loki', 'e98'),
    exact: true
  },
  {
    path: '/tags/nexus-oss',
    component: ComponentCreator('/tags/nexus-oss', '8c9'),
    exact: true
  },
  {
    path: '/tags/observability',
    component: ComponentCreator('/tags/observability', '850'),
    exact: true
  },
  {
    path: '/tags/opentelemetry-auto-instrument',
    component: ComponentCreator('/tags/opentelemetry-auto-instrument', 'e8c'),
    exact: true
  },
  {
    path: '/tags/prometheus',
    component: ComponentCreator('/tags/prometheus', '208'),
    exact: true
  },
  {
    path: '/tags/redis-cluster',
    component: ComponentCreator('/tags/redis-cluster', '34a'),
    exact: true
  },
  {
    path: '/tags/tempo',
    component: ComponentCreator('/tags/tempo', 'fa3'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '733'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '7e6'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ba6'),
            routes: [
              {
                path: '/docs/category/tutorial---basics',
                component: ComponentCreator('/docs/category/tutorial---basics', '20e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/tutorial---extras',
                component: ComponentCreator('/docs/category/tutorial---extras', '9ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/docs/tutorial-basics/congratulations', '458'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/docs/tutorial-basics/create-a-blog-post', '108'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/docs/tutorial-basics/create-a-document', '8fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/docs/tutorial-basics/create-a-page', '951'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/docs/tutorial-basics/deploy-your-site', '4f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/docs/tutorial-basics/markdown-features', 'b05'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/docs/tutorial-extras/manage-docs-versions', '978'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/docs/tutorial-extras/translate-your-site', 'f9a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '6d1'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
