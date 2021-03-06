/**
 * Created by qiaoheng on 6/27/16.
 */

import path from 'path';
import marko from 'marko';
import settings from 'server/initializers/settings';

export default function* (next) {
  this.render = this.render ||
    function (template: string, parameters: Object = {}) {
      this.type = 'text/html';

      return new Promise(resolve => {
        const templatePath = path.join(settings.path.ROOT, `${settings.path.TEMPLATES_DIR}/${template}`);
        const currentTemplate = process.env.NODE_ENV === 'production'
          ? global.nodeRequire(`${templatePath}.js`)
          : marko.load(templatePath);

        resolve(
          currentTemplate.stream({
            ...settings,
            ...parameters,
            csrf: this.csrf,
          })
        );
      });
    };

  yield next;
}