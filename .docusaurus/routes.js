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
    path: '/tags/auto-instrument',
    component: ComponentCreator('/tags/auto-instrument', 'd75'),
    exact: true
  },
  {
    path: '/tags/CI/CD',
    component: ComponentCreator('/tags/CI/CD', 'e9e'),
    exact: true
  },
  {
    path: '/tags/docker-compose',
    component: ComponentCreator('/tags/docker-compose', '350'),
    exact: true
  },
  {
    path: '/tags/GKE',
    component: ComponentCreator('/tags/GKE', '588'),
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
    path: '/tags/Loki',
    component: ComponentCreator('/tags/Loki', 'e68'),
    exact: true
  },
  {
    path: '/tags/nexus OSS',
    component: ComponentCreator('/tags/nexus OSS', '536'),
    exact: true
  },
  {
    path: '/tags/Observability',
    component: ComponentCreator('/tags/Observability', '07f'),
    exact: true
  },
  {
    path: '/tags/Opentelemetry',
    component: ComponentCreator('/tags/Opentelemetry', 'c2e'),
    exact: true
  },
  {
    path: '/tags/Prometheus',
    component: ComponentCreator('/tags/Prometheus', '47a'),
    exact: true
  },
  {
    path: '/tags/Redis Cluster',
    component: ComponentCreator('/tags/Redis Cluster', 'fc2'),
    exact: true
  },
  {
    path: '/tags/Tempo',
    component: ComponentCreator('/tags/Tempo', '0b7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '1a9'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '838'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'c9f'),
            routes: [
              {
                path: '/docs/Azure_cloud/AWS_Azure',
                component: ComponentCreator('/docs/Azure_cloud/AWS_Azure', '9a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Azure_cloud/AWS_codecommit',
                component: ComponentCreator('/docs/Azure_cloud/AWS_codecommit', '558'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Azure_cloud/CI_CD',
                component: ComponentCreator('/docs/Azure_cloud/CI_CD', '720'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Azure_cloud/Inner_Architecture',
                component: ComponentCreator('/docs/Azure_cloud/Inner_Architecture', 'e21'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Azure_cloud/Introduction',
                component: ComponentCreator('/docs/Azure_cloud/Introduction', 'b8c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Azure_cloud/Outer_Architecture',
                component: ComponentCreator('/docs/Azure_cloud/Outer_Architecture', '36d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/azure_cloud',
                component: ComponentCreator('/docs/category/azure_cloud', '4da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/image_recorgnition',
                component: ComponentCreator('/docs/category/image_recorgnition', 'b64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Image_Recorgnition/multiple_object_detecting',
                component: ComponentCreator('/docs/Image_Recorgnition/multiple_object_detecting', 'a5d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Image_Recorgnition/object_tracking',
                component: ComponentCreator('/docs/Image_Recorgnition/object_tracking', 'b96'),
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
