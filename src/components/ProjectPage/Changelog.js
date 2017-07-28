import React from 'react';
import Loader from 'components/Loader';
import timeSince from 'utils/time';
import api from 'api';

import './changelog-style.css';

const ProjectCreatedEvent = ({ data }) => (
  <div>
    Project <strong>{ data.name }</strong> created
  </div>
)

const NodeAddedEvent = ({ data }) => (
  <div>
    Added <strong>{ data.node.type }</strong> node <strong>{ data.node.title || data.node.key }</strong>
  </div>
)

const NodeRemovedEvent = ({ data }) => (
  <div>
    Removed <strong>{ data.node.type }</strong> node <strong>{ data.node.title || data.node.key }</strong>
  </div>
)

const NodeRenamedEvent = ({ data }) => (
  <div>
    Renamed node from <strong>{ data.node.from }</strong> to <strong>{ data.node.to }</strong>
  </div>
)

const NodeInputAddedEvent = ({ data }) => (
  <div>
    Added input <strong>{ data.node.input }</strong> to <strong>{ data.node.key }</strong>
  </div>
)

const NodeInputRemovedEvent = ({ data }) => (
  <div>
    Removed input <strong>{ data.node.input }</strong> from <strong>{ data.node.key }</strong>
  </div>
)

const NodeOutputAddedEvent = ({ data }) => (
  <div>
    Added output <strong>{ data.node.output }</strong> to <strong>{ data.node.key }</strong>
  </div>
)

const NodeOutputRemovedEvent = ({ data }) => (
  <div>
    Removed output <strong>{ data.node.output }</strong> from <strong>{ data.node.key }</strong>
  </div>
)

const DefaultEvent = ({ type }) => (
  <div className="Changelog-event">
    Event <span className="Changelog-event-type">{ type }</span> occurred
  </div>
)

// TODO: show option to open a diff of the text.
const NodeNotesChangedEvent = ({ data }) => (
  <div>
    Updated <strong>notes</strong> for <strong>{ data.id }</strong>
  </div>
)


const NodeFilesAddedEvent = ({ data }) => {
  const len = data.files.length;
  return (
    <div>
      Added {len} {len === 1 ? 'file' : 'files'} to <strong>{data.id}</strong>
      <ul style={{marginBottom: '5px'}}>
        {
          data.files.map((f) => (
            <li key={f.id || f.ID}>{f.name || f.Name}</li>
          ))
        }
      </ul>
    </div>
  );
}

const eventComponents = {
  'project.created': ProjectCreatedEvent,
  'node.added': NodeAddedEvent,
  'node.removed': NodeRemovedEvent,
  'node.renamed': NodeRenamedEvent,
  'node.input-added': NodeInputAddedEvent,
  'node.input-removed': NodeInputRemovedEvent,
  'node.output-added': NodeOutputAddedEvent,
  'node.output-removed': NodeOutputRemovedEvent,
  'node.updated-notes': NodeNotesChangedEvent,
  'node.added-files': NodeFilesAddedEvent,
};

const Event = (props) => {
  const Component = eventComponents[props.type] || DefaultEvent;

  // by <span className="Changelog-event-author">{ props.author }</span>
  return (
    <div className="Changelog-event">
      <Component {...props} />
      <div className="Changelog-event-info">
        Made <span className="Changelog-event-time">{timeSince(new Date(props.time * 1000))}</span>
      </div>
    </div>
  );
}

const Commit = ({ id, msg, time, author, events = [] }) => (
  <div className="Changelog-commit">
    <h6 className="Changelog-commit-msg">{ msg }</h6>

    <div className="Changelog-commit-info">
      <span className="Changelog-commit-author">{ author }</span> committed this <span className="Changelog-commit-time">{timeSince(new Date(time * 1000))}</span>
    </div>

    <div className="Changelog-commit-events">
      {events.map((e) => (
        <Event key={e.id} {...e} />
      ))}
    </div>
  </div>
)

const Changelog = ({ commits = [], pending = false }) => (
  <div className="Changelog">
    {commits.length > 0 ?
      commits.map((c) => (<Commit key={c.id} {...c} />) ) :
      !pending ? <div>No commits yet.</div> : undefined
    }
  </div>
)


class Pending extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
    this.props.onCommit(this.msg.value);
  }

  render() {
    const { events = [] } = this.props;

    if (events.length === 0) return <div />;

    return (
      <div className="Changelog-pending">
        <h6><em>Uncommitted changes</em></h6>

        <div className="Changelog-commit-events">
          {events.map((e) => (
            <Event key={e.id} {...e} />
          ))}
        </div>

        <form>
          <div className="form-group">
            <textarea required placeholder="Describe why these changes were made..." className="form-control" ref={(n) => {this.msg = n}} />
          </div>

          <button onClick={this.onSubmit} className="btn btn-sm btn-primary">Commit</button>
        </form>
      </div>
    )
  }
}


class ChangelogContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      commits: {
        loading: true,
        error: null,
      },
      pending: {
        loading: true,
        error: null,
      },
    };
  }

  refreshData = () => {
    this.setState({
      commits: {
        loading: true,
        error: null,
      },
      pending: {
        loading: true,
        error: null,
      },
    });

    api.client.getLog({
      id: this.props.project,
    })
    .then((resp) => {
      this.setState({
        commits: {
          data: resp,
        },
      });
    })
    .catch((err) => {
      this.setState({
        commits: {
          error: err,
          loading: false,
        },
      });
    });

    api.client.getLogPending({
      id: this.props.project,
    })
    .then((resp) => {
      this.setState({
        pending: {
          data: resp,
        },
      });
    })
    .catch((err) => {
      this.setState({
        pending: {
          error: err,
          loading: false,
        },
      });
    });
  }

  componentDidMount() {
    this.refreshData();
  }

  onCommit = (msg) => {
    api.client.commitLog({
      id: this.props.project,
      msg: msg,
    })
    .then(() => {
      this.refreshData();
    });
  }

  render() {
    const { loading, commits, pending, error } = this.state;

    if (commits.loading || pending.loading) {
      return <Loader />;
    }

    if (commits.error || pending.error) {
      return (
        <div className="alert alert-danger">
          {commits.error ? commits.error.message : pending.error.message}
        </div>
      );
    }

    return (
      <div>
        <Pending
          onCommit={this.onCommit}
          events={pending.data} />

        <Changelog
          commits={commits.data}
          pending={pending.data.length > 0} />
      </div>
    )
  }
}

export default ChangelogContainer;
