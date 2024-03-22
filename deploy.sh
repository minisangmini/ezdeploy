docker build . -t ezdeploy-backend
docker rm -f ezdeploy-backend
docker run --name=ezdeploy-backend --restart=always --network=my-network -v /var/run/docker.sock:/var/run/docker.sock -d ezdeploy-backend
